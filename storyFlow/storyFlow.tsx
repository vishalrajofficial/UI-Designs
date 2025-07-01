import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';

type TransitionTypes = 'cut' | 'fade' | 'dissolve' | 'wipe';

interface Scene {
    id: string;
    title: string;
    startFrame: number;
    endFrame: number;
    thumbnail: string;
    transition: TransitionTypes;
    trackIndex: number;
}
 const AppLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 font-['Roboto_Slab'] text-white">
        {children}
    </div>
);
const transitionColors: Record<TransitionTypes, string> = {
    cut: 'border-blue-700 bg-blue-900/75',
    fade: 'border-blue-600 bg-blue-800/75',
    dissolve: 'border-sky-700 bg-sky-900/75',
    wipe: 'border-pink-700 bg-pink-900/75'
};

function isOverlapping(draggedSceneId: string, newStart: number, newEnd: number, allScenes: SceneType[]) {
  return allScenes.some(scene => {
    if (scene.id === draggedSceneId) return false; // skip the dragged one
    return newStart < scene.endFrame && newEnd > scene.startFrame;
  });
}


const StoryFlowApp: React.FC = () => {
    const [currentView, setCurrentView] = useState<'landing' | 'editor'>('landing');
    const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success' | 'info' | 'error'}>>([]);

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 4000);
    };

    const ToastContainer = () => (
        <div className="fixed top-20 right-4 z-[9999] space-y-2">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in ${
                        toast.type === 'success' ? 'bg-green-600 text-white' :
                        toast.type === 'error' ? 'bg-red-600 text-white' :
                        'bg-blue-600 text-white'
                    }`}
                    style={{
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    <div className="flex items-center space-x-2">
                        {toast.type === 'success' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                        )}
                        {toast.type === 'info' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                        )}
                        <span className="font-medium">{toast.message}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const LandingPage = () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 font-['Roboto_Slab']">
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                @keyframes glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
                    }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                html {
                    scroll-behavior: smooth;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }
            `}</style>

           
            <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-blue-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
                            </svg>
                            <span className="text-xl font-bold text-white">StoryFlow Pro</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
                            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                            <button 
                                onClick={() => setCurrentView('editor')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Try Free Demo
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

         
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="mb-8">
                        <span className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                            Professional Storyboarding Made Simple
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
                        Create Stunning
                        <span className="bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent animate-pulse"> Visual Stories</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up">
                        The most intuitive timeline-based storyboard editor for filmmakers, animators, and creative professionals. 
                        Drag, drop, and bring your vision to life with precision timing and seamless collaboration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                            onClick={() => setCurrentView('editor')}
                            className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg animate-pulse hover:animate-none"
                        >
                            Start Creating Now - Free
                        </button>
                    </div>
                    <div className="mt-12 text-sm text-gray-400">
                        Trusted by 10,000+ creators worldwide • No credit card required
                    </div>
                </div>
            </section>

          
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Powerful Features for Every Creator</h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Everything you need to plan, visualize, and execute your creative projects with precision.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zm-3 5h12v10H6V8z"/>
                                    </svg>
                                ),
                                title: "Timeline-Based Editing",
                                description: "Intuitive drag-and-drop interface with precise frame control and smooth transitions between scenes."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                ),
                                title: "Visual Storyboards",
                                description: "Upload thumbnails, set transitions, and visualize your entire project flow in one comprehensive view."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                ),
                                title: "Professional Export",
                                description: "Generate beautiful PDF storyboards for client presentations and team collaboration."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                ),
                                title: "Real-time Collaboration",
                                description: "Work with your team in real-time, share feedback, and iterate faster than ever before."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                    </svg>
                                ),
                                title: "Advanced Transitions",
                                description: "Choose from cut, fade, dissolve, and wipe transitions with visual indicators for clear planning."
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                                    </svg>
                                ),
                                title: "Cloud Sync",
                                description: "Access your projects anywhere with automatic cloud synchronization and version history."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all transform hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-float">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 text-blue-400 animate-glow">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
                        <p className="text-xl text-gray-300">Start free, scale as you grow</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Free",
                                price: "$0",
                                period: "forever",
                                features: [
                                    "Up to 3 projects",
                                    "Basic timeline editing",
                                    "PDF export",
                                    "Community support",
                                    "720p export quality"
                                ],
                                cta: "Start Free",
                                popular: false,
                                action: () => setCurrentView('editor')
                            },
                            {
                                name: "Pro",
                                price: "$29",
                                period: "per month",
                                features: [
                                    "Unlimited projects",
                                    "Advanced transitions",
                                    "Real-time collaboration",
                                    "Priority support",
                                    "4K export quality",
                                    "Cloud storage (100GB)",
                                    "Custom branding"
                                ],
                                cta: "Start 14-Day Trial",
                                popular: true,
                                action: () => {
                                    showToast("Starting your 14-day free trial! Welcome to StoryFlow Pro!", "success");
                                    setTimeout(() => setCurrentView('editor'), 1000);
                                }
                            },
                            {
                                name: "Enterprise",
                                price: "$99",
                                period: "per month",
                                features: [
                                    "Everything in Pro",
                                    "Unlimited team members",
                                    "Advanced analytics",
                                    "SSO integration",
                                    "Dedicated support",
                                    "Custom integrations",
                                    "Unlimited storage"
                                ],
                                cta: "Contact Sales",
                                popular: false,
                                action: () => {
                                    showToast("Thank you for your interest! Our sales team will contact you within 24 hours.", "info");
                                }
                            }
                        ].map((plan, index) => (
                            <div key={index} className={`relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border ${plan.popular ? 'border-blue-500 scale-105' : 'border-gray-700/50'} transition-all hover:border-blue-500/50 hover:scale-105 hover:shadow-2xl`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="text-4xl font-bold text-white mb-1">
                                        {plan.price}
                                        <span className="text-lg text-gray-400">/{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-gray-300">
                                            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={plan.action}
                                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${plan.popular 
                                        ? 'bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-lg' 
                                        : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        
            <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Loved by Creators Worldwide</h2>
                        <p className="text-xl text-gray-300">See what professionals are saying about StoryFlow Pro</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Film Director",
                                company: "Moonlight Studios",
                                photo: "https://picsum.photos/100?random=1",
                                testimonial: "StoryFlow Pro revolutionized our pre-production process. The timeline editing is so intuitive, and the PDF exports are perfect for client presentations."
                            },
                            {
                                name: "Marcus Rodriguez",
                                role: "Animation Lead",
                                company: "Pixel Dreams",
                                photo: "https://picsum.photos/100?random=2",
                                testimonial: "The collaboration features are game-changing. Our entire team can work on storyboards simultaneously, and the transition previews help us plan sequences perfectly."
                            },
                            {
                                name: "Emily Watson",
                                role: "Creative Director",
                                company: "Brand Stories Inc.",
                                photo: "https://picsum.photos/100?random=3",
                                testimonial: "We've tried many storyboarding tools, but none match the professional quality and ease of use that StoryFlow Pro provides. It's now essential to our workflow."
                            },
                            {
                                name: "David Park",
                                role: "Independent Filmmaker",
                                company: "Park Productions",
                                photo: "https://picsum.photos/100?random=4",
                                testimonial: "As an indie filmmaker, I need tools that are both powerful and affordable. StoryFlow Pro delivers on both fronts with features that rival expensive software."
                            },
                            {
                                name: "Lisa Thompson",
                                role: "UX Designer",
                                company: "Digital Craft Co.",
                                photo: "https://picsum.photos/100?random=5",
                                testimonial: "Even for non-video projects, StoryFlow Pro helps us plan user journeys and experience flows. The visual timeline is incredibly helpful for any sequential design process."
                            },
                            {
                                name: "James Miller",
                                role: "Documentary Producer",
                                company: "Truth & Light Films",
                                photo: "https://picsum.photos/100?random=6",
                                testimonial: "The cloud sync feature means I can work on storyboards anywhere. The real-time collaboration has made working with remote teams seamless and efficient."
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all transform hover:scale-105 animate-fade-in-up">
                                <div className="flex items-center mb-4">
                                    <img 
                                        src={testimonial.photo} 
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover mr-4 animate-float"
                                    />
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic">"{testimonial.testimonial}"</p>
                                <div className="flex mt-4 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

      
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Creative Process?</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join thousands of creators who've already revolutionized their workflow with StoryFlow Pro.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => setCurrentView('editor')}
                            className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                            Start Your Free Trial
                        </button>
                        <button 
                            onClick={() => {
                                showToast("Demo scheduled! We'll send you a calendar invite within the next hour.", "success");
                            }}
                            className="border border-gray-400 text-gray-300 hover:text-white hover:border-white px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105 hover:shadow-lg">
                            Schedule Demo
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </div>
            </section>

      
            <footer id="contact" className="bg-black/80 border-t border-gray-800 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
                                </svg>
                                <span className="text-xl font-bold text-white">StoryFlow Pro</span>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                The professional storyboard editor designed for creators who demand precision, 
                                collaboration, and beautiful results.
                            </p>
                            <div className="flex space-x-4">
                                {['Twitter', 'LinkedIn', 'YouTube', 'Instagram'].map((social) => (
                                    <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <span className="sr-only">{social}</span>
                                        <div className="w-6 h-6 bg-gray-600 rounded"></div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                {['Features', 'Pricing', 'API', 'Integrations', 'Changelog'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                {['About', 'Blog', 'Careers', 'Contact', 'Press'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm">
                            © 2025 StoryFlow Pro
                        </div>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <a key={item} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );

  
    const StoryboardEditor = () => {
        const [scenes, setScenes] = useState<Scene[]>([
            {
                id: '1',
                title: 'Opening Scene',
                startFrame: 0,
                endFrame: 120,
                thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiM0YTVmN2YiLz48dGV4dCB4PSI1MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5TY2VuZSAxPC90ZXh0Pjwvc3ZnPg==',
                transition: 'fade',
                trackIndex: 0
            },
            {
                id: '2',
                title: 'Action Sequence',
                startFrame: 120,
                endFrame: 300,
                thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiM3ZjRhNWYiLz48dGV4dCB4PSI1MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5TY2VuZSAyPC90ZXh0Pjwvc3ZnPg==',
                transition: 'cut',
                trackIndex: 0
            },
            {
                id: '3',
                title: 'Dialogue Scene',
                startFrame: 300,
                endFrame: 480,
                thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIGZpbGw9IiM1ZjdhNGYiLz48dGV4dCB4PSI1MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0Ij5TY2VuZSAzPC90ZXh0Pjwvc3ZnPg==',
                transition: 'dissolve',
                trackIndex: 1
            }
        ]);
        
        const audioTracks = [
                    [30, 60, 90],
                    [150, 200],
                    [250, 320, 280, 440]
                    ];

        const oneFrame = .2;
        const oneFrameUnit = 'em';

        const [zoom, setZoom] = useState(1);
        const [selectedScene, setSelectedScene] = useState<string | null>(null);
        const [draggedScene, setDraggedScene] = useState<string | null>(null);
        const [trackHeights, setTrackHeights] = useState<number[]>([120, 120, 120]);
        const [fps] = useState(24);
        
        const [lastWidth, setLastWidth] = useState(getTotalFrames());
        const totalFrames = getTotalFrames();

        const lastTrack = trackHeights.length - 1;

        const canvasRef = useRef<HTMLDivElement>(null);
        const timelineRef = useRef<HTMLDivElement>(null);
        const pdfExportRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const bodyContainerRef = useRef<HTMLDivElement>(null);
        const minHeight = 120;
        const maxHeight = 240;

        function getTotalFrames() {
            return Math.max(...scenes.map(s => s.endFrame + 100), 600);
        }

        const pixelToFrame = (pixel: number): number => {
            if (pixel <= 0) return 0;
            const theFrame = Math.round(pixel / (3.2 * zoom));
            return theFrame;
        }

        const handleSceneMouseDown = (e: React.MouseEvent, sceneId: string) => {
            e.preventDefault();
            setDraggedScene(sceneId);
            setSelectedScene(sceneId);
            setLastWidth(getTotalFrames());
        }

        const handleMouseMove = useCallback((e: MouseEvent) => {
            if (!draggedScene || !canvasRef.current || !timelineRef.current || !containerRef.current || !bodyContainerRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            const bodyRect = bodyContainerRef.current.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const frame = pixelToFrame(x);

            const maximumScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;
            const positionInContainer = containerRef.current.clientWidth - x;
            const scrollThreshold = maximumScroll * .8;
            const lowerThreshold = bodyRect.left + bodyContainerRef.current.clientWidth * 1.1 * .15;
            
            if (e.clientX + 15 < bodyRect.left) {
                containerRef.current!.scroll({ behavior: 'smooth', left: 0 });
            }
            else if (e.clientX < lowerThreshold) {
                if (containerRef.current.scrollLeft > 0)
                    containerRef.current!.scroll({ behavior: 'smooth', left: containerRef.current.scrollLeft - containerRef.current.scrollWidth * .025 });
            }
            else if (positionInContainer < containerRef.current!.scrollWidth * .1 && containerRef.current!.scrollLeft < scrollThreshold) {
                containerRef.current!.scroll({ behavior: 'smooth', left: containerRef.current.scrollLeft + containerRef.current.scrollWidth * .025 });
            } 

            setScenes(prev => prev.map(scene => {
                if (scene.id === draggedScene) {
                    const duration = scene.endFrame - scene.startFrame;
                    const endFrame = Math.max(0, frame - duration * .6) + duration;

                    if ((endFrame + 100) > lastWidth) {                    
                        setLastWidth(endFrame + 100);
                    }

                    return {
                        ...scene,
                        startFrame: Math.max(0, frame - duration * .6),
                        endFrame: endFrame
                    };
                }
                return scene;
            }));
        }, [draggedScene, lastWidth, zoom]);

        const handleMouseUp = useCallback(() => {
            setDraggedScene(null);
            const lastTotalFrames = getTotalFrames();
            setLastWidth(prev => prev > lastTotalFrames ? prev : lastTotalFrames);
        }, []);

        useEffect(() => {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }, [handleMouseMove, handleMouseUp]);

        const minZoom = .5;
        const maxZoom = 1.5;

        const handleZoom = (delta: number) => {
            setZoom(prev => Math.max(minZoom, Math.min(maxZoom, prev + delta)));
        };

        const handleTrackHeightChange = (trackIndex: number, delta: number) => {
            setTrackHeights(prev => {
                const newHeights = [...prev];
                newHeights[trackIndex] = Math.max(minHeight, Math.min(maxHeight, newHeights[trackIndex] + delta));
                return newHeights;
            });
        };

       
        const handleExportPDF = () => {
            const exportData = {
                title: "StoryFlow Pro - Project Storyboard",
                date: new Date().toLocaleDateString(),
                scenes: scenes.map((scene, index) => ({
                    number: index + 1,
                    title: scene.title,
                    duration: ((scene.endFrame - scene.startFrame) / fps).toFixed(2),
                    frames: `${scene.startFrame} - ${scene.endFrame}`,
                    transition: scene.transition,
                    track: scene.trackIndex + 1,
                    thumbnail: scene.thumbnail
                })),
                totalDuration: (totalFrames / fps).toFixed(1),
                totalFrames: totalFrames,
                fps: fps
            };

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>StoryFlow Pro - Storyboard Export</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Roboto Slab', serif; margin: 20px; background: white; color: black; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #1e40af; margin: 0; font-size: 24px; font-weight: 700; }
        .header p { color: #666; margin: 10px 0; font-weight: 400; }
        .scenes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .scene-card { border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; page-break-inside: avoid; }
        .scene-thumbnail { width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 10px; }
        .scene-info { font-size: 14px; font-weight: 400; }
        .scene-title { font-weight: 700; font-size: 16px; margin-bottom: 5px; }
        .scene-detail { margin-bottom: 3px; font-weight: 400; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-weight: 400; }
        .footer p { font-weight: 500; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>${exportData.title}</h1>
        <p>Generated on ${exportData.date}</p>
    </div>
    <div class="scenes-grid">
        ${exportData.scenes.map(scene => `
            <div class="scene-card">
                <img src="${scene.thumbnail}" alt="${scene.title}" class="scene-thumbnail" />
                <div class="scene-info">
                    <div class="scene-title">Scene ${scene.number}: ${scene.title}</div>
                    <div class="scene-detail">Duration: ${scene.duration}s</div>
                    <div class="scene-detail">Frames: ${scene.frames}</div>
                    <div class="scene-detail">Transition: ${scene.transition}</div>
                    <div class="scene-detail">Track: ${scene.track}</div>
                </div>
            </div>
        `).join('')}
    </div>
    <div class="footer">
        <p>Total Duration: ${exportData.totalDuration}s | Total Frames: ${exportData.totalFrames} | FPS: ${exportData.fps}</p>
        <p style="font-size: 12px; font-weight: 400;">Created with StoryFlow Pro - Professional Storyboard Editor</p>
    </div>
</body>
</html>`;

            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(htmlContent);
                newWindow.document.close();
                newWindow.focus();
                setTimeout(() => {
                    newWindow.print();
                }, 500);
            } else {
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'storyboard-export.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        };

       


        return (
            <div className="storyboard-editor max-w-screen min-h-screen box-border text-white flex flex-col overflow-hidden font-['Roboto_Slab'] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 backdrop-blur-lg">
                
                <div className="fixed left-0 top-0 right-0 bottom-0 bg-blue-400/15" style={{backdropFilter: 'blur(.6em)'}}></div>
                
                <section className="flex flex-col self-center my-8 py-6 px-8 rounded-xl flex-1 w-[77em] mx-auto bg-zinc-950/60 shadow-xl backdrop-blur-lg overflow-hidden"
                    style={{backdropFilter: 'blur(.6em)', boxShadow: '0.75em 0.75em 0.75em rgba(0,0,0,0.7)'}} 
                    ref={bodyContainerRef}>
                    
                 
                   <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-blue-500/20 shadow-md px-10 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-white">
                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
                            </svg>
                            <span className="text-2xl font-bold">StoryFlow Pro</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-300">
                            <button onClick={() => setCurrentView('landing')} className="hover:text-white transition">← Back to Landing</button>
                            <button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold shadow-sm">
                            Export PDF
                            </button>
                        </div>
                </header>



                 
<main
  className="overflow-x-auto overflow-y-auto p-4 h-[560px] transition-[font-size] duration-300 ease-in timeline-container bg-gray-900"
  ref={containerRef}
  style={{
    fontSize: `${zoom * 100}%`,
    backdropFilter: 'blur(.6em)',
    scrollbarWidth: 'thin',
    scrollbarColor: '#3b82f6 #374151'
  }}
>
  <style>{`
    .timeline-container::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
    .timeline-container::-webkit-scrollbar-track {
      background: #374151;
      border-radius: 6px;
    }
    .timeline-container::-webkit-scrollbar-thumb {
      background: linear-gradient(45deg, #3b82f6, #ec4899);
      border-radius: 6px;
      border: 2px solid #374151;
    }
    .timeline-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(45deg, #2563eb, #db2777);
    }
    .timeline-container::-webkit-scrollbar-corner {
      background: #374151;
    }
  `}</style>

  <>
    {/* Timeline ruler */}
    <section
      className="h-16 overflow-hidden border-b-4 border-white rounded-t-lg bg-sky-900/80 sticky top-[-1em]"
      style={{
        width: `${oneFrame * (Math.ceil(lastWidth / 10) * 10) + 2}${oneFrameUnit}`,
        zIndex: 999,
        backdropFilter: 'blur(0.6em)',
        boxShadow: 'inset 0 -4px 6px rgba(255, 255, 255, 0.1)'
      }}
    >
      <div ref={timelineRef} className="m-4 flex flex-row select-none">
        {Array.from({ length: Math.ceil(lastWidth / 10) }, (_, i) => i * 10).map(frame => (
          <div
            key={frame}
            className="flex flex-col justify-between items-center"
            style={{ width: `${oneFrame * 10}${oneFrameUnit}` }}
          >
            <span className="h-4 text-center text-white font-semibold text-sm select-none mb-1">
              {frame % 50 === 0 ? frame : ''}
            </span>
            <span
              className="mx-auto bg-white rounded-sm"
              style={{
                height: frame % 50 === 0 ? '1.5em' : '1em',
                width: '2px',
                opacity: 0.7
              }}
            ></span>
          </div>
        ))}
      </div>
    </section>

    {/* Timeline canvas: scenes + audio */}
    <section
      ref={canvasRef}
      className="border-sky-900/80 rounded-b-[.5em] border-[.5em] border-b-0"
      style={{
        flex: 1,
        width: `${oneFrame * (Math.ceil(lastWidth / 10) * 10) + 2}${oneFrameUnit}`,
        position: 'relative',
        backdropFilter: 'blur(.6em)'
      }}
    >
      <div className="p-[.25em] bg-sky-900/80 relative" style={{ backdropFilter: 'blur(.6em)' }}>
        {trackHeights.map((height, trackIndex) => (
          <div
            key={trackIndex}
            className={`m-[.25em] mb-[1em] rounded-[.2em] ${
              trackIndex % 2 ? 'bg-pink-400/75' : 'bg-sky-600/75'
            } relative`}
            style={{ height: `${height / 16}em`, backdropFilter: 'blur(.6em)' }}
          >
            {/* Track header + controls (up/down) */}
            <div className="absolute left-2 top-2 flex items-center gap-2 z-20 bg-black/60 rounded-lg px-2 py-1">
              <span className="text-xs text-white font-medium">Track {trackIndex + 1}</span>
              <button
                onClick={() => handleTrackHeightChange(trackIndex, 20)}
                className="w-6 h-6 bg-blue-600/80 hover:bg-blue-700 rounded text-white text-xs flex items-center justify-center transition-colors"
                title="Increase track height"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => handleTrackHeightChange(trackIndex, -20)}
                className="w-6 h-6 bg-blue-600/80 hover:bg-blue-700 rounded text-white text-xs flex items-center justify-center transition-colors"
                title="Decrease track height"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Drag-to-resize handle */}
            <div
              className="absolute bottom-[-0.5em] left-0 right-0 h-[2em] cursor-ns-resize z-10 flex items-center justify-center group"
              onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                const startHeight = trackHeights[trackIndex];

                const handleDrag = (e: MouseEvent) => {
                  const delta = e.clientY - startY;
                  const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + delta * 0.5));
                  setTrackHeights(prev => {
                    const newHeights = [...prev];
                    newHeights[trackIndex] = newHeight;
                    return newHeights;
                  });
                };

                const handleRelease = () => {
                  document.removeEventListener('mousemove', handleDrag);
                  document.removeEventListener('mouseup', handleRelease);
                };

                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', handleRelease);
              }}
              title="Drag to resize track height"
            >
              <div className="w-16 h-1 bg-blue-500/40 group-hover:bg-blue-500/80 rounded-full transition-colors relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                  <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                  <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                </div>
              </div>
            </div>

            {/* Scene Timeline (horizontal layout, non-stackable) */}
            <div className="relative w-full h-[140px] rounded-lg bg-black/40 overflow-x-auto px-4 py-3 shadow-inner border border-blue-700">
              {scenes
                .filter(scene => scene.trackIndex === 0)
                .map(scene => (
                  <div
                    key={scene.id}
                    className={`transition-all duration-150 box-border border-2 ${
                      selectedScene === scene.id
                        ? 'border-blue-500 shadow-blue-500/50'
                        : 'border-blue-600/40'
                    } bg-gray-800/90 h-[6.25em] hover:bg-pink-900/80 rounded-md overflow-hidden shadow-lg ${
                      draggedScene === scene.id ? 'scale-105 shadow-2xl z-50' : ''
                    }`}
                    style={{
                      position: 'absolute',
                      left: `${scene.startFrame * oneFrame}em`,
                      width: `${(scene.endFrame - scene.startFrame) * oneFrame}em`,
                      top: '.6em',
                      cursor: draggedScene === scene.id ? 'grabbing' : 'grab',
                      transition: draggedScene === scene.id ? 'none' : 'all 0.3s ease-in',
                      backdropFilter: 'blur(0.6em)',
                      boxShadow:
                        selectedScene === scene.id
                          ? '0 0 0 3px rgba(59, 130, 246, 0.5)'
                          : '0 2px 8px rgba(0,0,0,0.15)',
                      transform: draggedScene === scene.id ? 'scale(1.05)' : 'scale(1)',
                      zIndex: draggedScene === scene.id ? 50 : 'auto'
                    }}
                    onMouseDown={(e) => handleSceneMouseDown(e, scene.id)}
                  >
                    <div
                      className="absolute left-2 top-2 w-[3.75em] h-[3em] bg-cover rounded-sm border-2 border-gray-900 shadow-inner"
                      style={{ backgroundImage: `url(${scene.thumbnail})` }}
                    />
                    <div className="absolute left-[5em] top-1 right-2">
                      <div className="text-[1.5em] font-bold text-white drop-shadow-sm">{scene.title}</div>
                      <div className="mt-1 text-[1em] text-gray-300">
                        {scene.endFrame - scene.startFrame} frames (
                        {((scene.endFrame - scene.startFrame) / fps).toFixed(1)}s)
                      </div>
                    </div>
                    <div className="text-gray-300 absolute bottom-1 left-2 text-[1em] select-none">
                      {scene.startFrame} - {scene.endFrame}
                    </div>
                    <div
                      className={`box-border border-2 px-4 translate-y-[-50%] right-3 top-1/2 uppercase py-2 text-[0.9em] rounded-md absolute ${transitionColors[scene.transition]} shadow-md`}
                    >
                      {scene.transition}
                    </div>
                  </div>
                ))}
            </div>

            {/* Audio Tracks */}
            <div className="mt-8 flex flex-col gap-4">
              {audioTracks.map((trackFrameList, trackIndex) => (
                <div
                  key={trackIndex}
                  className="relative h-[60px] rounded-md bg-sky-900/70 border border-sky-600 shadow-inner overflow-hidden"
                >
                  <div className="absolute left-2 top-1 text-sm text-white/70 z-20">
                    Track {trackIndex + 1}
                  </div>
                  {trackFrameList.map((frame, i) =>
                    frame <= totalFrames ? (
                      <div
                        key={`t-${trackIndex}-${i}`}
                        className="absolute top-0 bottom-0 w-[0.3em] bg-pink-600/80 z-10"
                        title={`Audio marker at frame ${frame}`}
                        style={{ left: `${frame * oneFrame}em` }}
                      />
                    ) : null
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  </>
</main>


                    
                    <footer className="flex flex-1 items-center justify-between text-lg text-gray-100 bg-black px-4 py-3">
                        <section><span>FPS: <span className="text-blue-400 font-semibold">{fps}</span></span></section>
                        <section><span>Total Duration: <span className="text-blue-400 font-semibold">{(totalFrames / fps).toFixed(1)}s</span></span></section>
                        <section><span>Total Frames: <span className="text-blue-400 font-semibold">{totalFrames}</span></span></section>
                        <section><span>Scenes: <span className="text-blue-400 font-semibold">{scenes.length}</span></span></section>
                        {selectedScene && (
                            <section><span>Selected: <span className="text-blue-400 font-semibold">{scenes.find((s) => s.id === selectedScene)?.title}</span></span></section>
                        )}
                    </footer>

                    <footer className="w-full text-center py-6 mt-auto text-sm text-gray-400 border-t border-blue-500/10">
                        © 2025 StoryFlow Pro — Built for creators and visual thinkers.
                    </footer>

                </section>
            </div>
        );
    };

return (
    <AppLayout>
        <div>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap');`}
            </style>
            <ToastContainer />
            {currentView === 'landing' ? <LandingPage /> : <StoryboardEditor />}
        </div>
    </AppLayout>
    );
};

export default StoryFlowApp;