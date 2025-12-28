"use client";

import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import Head from "@/components/head/Head";
import AIHome from "@/components/AiHome/AIHome";
import Services from "@/components/Services/Services";
import CoachesHome from "@/components/coaches/CoachesHome";
import BlogHome from "@/components/blog/BlogHome";
import Link from "next/link";
import { FaArrowRight, FaDumbbell, FaChartLine, FaUsers, FaHeartbeat } from "react-icons/fa";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: { 
    transition: { staggerChildren: 0.1 } 
  },
  viewport: { once: true }
};

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-white overflow-x-hidden relative min-h-screen">

        {/* Hero Section */}
        <div className="relative z-10">
          <Head />
        </div>

        {/* Features Section - Clean & Modern */}
        <section className="relative py-10 md:py-12 bg-white overflow-hidden z-10">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#52796F]/3 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6BB371]/3 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#52796F]/10 border border-[#52796F]/20 rounded-full text-[#52796F] text-sm font-semibold mb-6">
                <FaHeartbeat className="text-[#6BB371]" />
                <span>Why Choose TrainSight</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-[#354F52]">Powerful Features</span>{" "}
                <span className="text-[#52796F]">For Your Success</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Everything you need to achieve your fitness goals in one powerful platform
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  icon: FaDumbbell,
                  title: "AI Form Analysis",
                  desc: "Real-time feedback on your technique to perfect every movement",
                  color: "from-[#354F52] to-[#52796F]"
                },
                {
                  icon: FaChartLine,
                  title: "Progress Tracking",
                  desc: "Detailed analytics and insights to monitor your improvement",
                  color: "from-[#52796F] to-[#6BB371]"
                },
                {
                  icon: FaUsers,
                  title: "Expert Coaches",
                  desc: "Connect with certified professionals for personalized guidance",
                  color: "from-[#6BB371] to-[#52796F]"
                },
                {
                  icon: FaHeartbeat,
                  title: "Health Monitoring",
                  desc: "Track your vitals and recovery for optimal performance",
                  color: "from-[#354F52] to-[#6BB371]"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-[#C8CDC5]/50 hover:border-[#52796F]/50"
                >
                  {/* Icon */}
                  <div className={`relative mb-4 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <feature.icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#354F52] mb-2 group-hover:text-[#52796F] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AI Technology Section */}
        <section className="relative bg-[#F8F9F7] overflow-hidden z-10">
          <div className="relative z-10">
            <AIHome />
          </div>
        </section>

        {/* Services Section */}
        <section className="relative bg-white py-8 z-10">
          <div className="relative z-10">
            <Services />
          </div>
        </section>

        {/* Coaches Section */}
        <section className="relative bg-white py-8 z-10">
          <div className="relative z-10">
            <CoachesHome />
          </div>
        </section>

        {/* Blog Section */}
        <section className="relative bg-[#F8F9F7] py-8 overflow-hidden z-10">
          <div className="relative z-10">
            <BlogHome />
          </div>
        </section>

        {/* Final CTA Section - Clean Design */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#354F52] via-[#52796F] to-[#354F52] overflow-hidden z-10">
          {/* Grid Background for CTA - White grid on dark background */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.grid-line%7Bstroke:white;stroke-width:0.4;fill:none;stroke-linecap:round%7D%3C/style%3E%3C/defs%3E%3Cpath class='grid-line' d='M0 0 Q2 1 0 2 T0 4 T0 6 T0 8 T0 10 T0 12 T0 14 T0 16 T0 18 T0 20 T0 22 T0 24 T0 26 T0 28 T0 30 T0 32 T0 34 T0 36 T0 38 T0 40 T0 42 T0 44 T0 46 T0 48 T0 50 T0 52 T0 54 T0 56 T0 58 T0 60'/%3E%3Cpath class='grid-line' d='M0 0 Q1 2 2 0 T4 0 T6 0 T8 0 T10 0 T12 0 T14 0 T16 0 T18 0 T20 0 T22 0 T24 0 T26 0 T28 0 T30 0 T32 0 T34 0 T36 0 T38 0 T40 0 T42 0 T44 0 T46 0 T48 0 T50 0 T52 0 T54 0 T56 0 T58 0 T60 0'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Clean Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#6BB371]/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-8">
                <FaHeartbeat className="text-[#6BB371]" />
                <span>Ready to Transform Your Fitness Journey?</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                Start Your
                <span className="block text-[#6BB371] mt-2">Transformation Today</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                Join thousands of athletes who are achieving their goals with AI-powered coaching and expert guidance
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="#signup"
                  className="group px-10 py-5 bg-[#6BB371] text-white text-lg font-bold rounded-2xl shadow-xl hover:bg-[#52796F] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  Get Started Free
                  <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/coaches"
                  className="px-10 py-5 border-2 border-white/30 text-white text-lg font-bold rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Explore Coaches
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
