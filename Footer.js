import React from 'react';
import { BarChart3, Mail, Github, Twitter } from 'lucide-react';

const Footer= () => {
    return (
        <footer className=" bg-slate-900 text-white py-12 mt-20">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">Excel Analytics</span>
                        </div>
                        <p className="text-slate-400 mb-6 max-w-md">
                            Transform your Excel data into beautiful visualizations with ease.
                            Fast, secure, and powerful analytics at your fingertips.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://github.com/Swargpatel" className="text-slate-400 hover:text-white transition-colors" rel="noreferrer" target='_blank'>
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="/" className="text-slate-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="/" className="text-slate-400 hover:text-white transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="/" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="/" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="/" className="hover:text-white transition-colors">API</a></li>
                            <li><a href="/" className="hover:text-white transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="/" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="/" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="/" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="/" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
                    <p>&copy; 2025 Excel Analytics. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;