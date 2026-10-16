import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Specialties from "./components/Specialties.jsx";
import DoctorShowcase from "./components/DoctorShowcase.jsx";
import Facilities from "./components/Facilities.jsx";
import Awards from "./components/Awards.jsx";
import Locations from "./components/Locations.jsx";
import Faq from "./components/Faq.jsx";
import PatientTrust from "./components/PatientTrust.jsx";
import BookingCtaBanner from "./components/BookingCtaBanner.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import TermsPrivacyModal from "./components/TermsPrivacyModal.jsx";

export default function App() {
  const [modalType, setModalType] = useState(null); // 'terms' | 'privacy'

  return (
    <div className="hospital-website-app">
      {/* Public Navigation Bar with Book an Appointment CTA */}
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* About the Hospital */}
        <About />

        {/* 12 Medical Specialties & Clinical Services */}
        <Specialties />

        {/* Premium Doctors Directory with Real-time DB Fetch */}
        <DoctorShowcase />

        {/* Hospital Facilities & Infrastructure */}
        <Facilities />

        {/* Accreditations, Certifications & Standards */}
        <Awards />

        {/* Hospital Campus Locations & Map Directions */}
        <Locations />

        {/* Frequently Asked Patient Questions */}
        <Faq />

        {/* Patient Care Standards & Trust Philosophy */}
        <PatientTrust />

        {/* High-Impact Bottom Booking CTA Strip */}
        <BookingCtaBanner />

        {/* Hospital Helpdesk & Inquiry Form */}
        <Contact />
      </main>

      {/* Public Patient Footer */}
      <Footer
        onOpenTerms={() => setModalType("terms")}
        onOpenPrivacy={() => setModalType("privacy")}
      />

      {/* Patient Privacy Policy & Terms of Care Modal */}
      <TermsPrivacyModal
        type={modalType}
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
