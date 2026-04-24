import React, { useState, useEffect } from 'react';
import { FiDownload, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiBriefcase, FiAward, FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import './template.css';

const ResumeForm = ({ initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    skills: '',
    template: 'basic',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        education: initialData.education?.map(e => `${e.degree}, ${e.university}, ${e.year}`).join('\n') || '',
        experience: initialData.experience?.map(e => `${e.company}, ${e.role}, ${e.duration}`).join('\n') || '',
        skills: initialData.skills?.join(', ') || '',
        template: 'basic'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      education: formData.education.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split(',');
        return {
          degree: parts[0]?.trim() || '',
          university: parts[1]?.trim() || '',
          year: parts[2]?.trim() || ''
        };
      }),
      experience: formData.experience.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split(',');
        return {
          company: parts[0]?.trim() || '',
          role: parts[1]?.trim() || '',
          duration: parts[2]?.trim() || ''
        };
      }),
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    };

    try {
      const response = await axios.post('http://localhost:5000/generate-resume', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `resume_${formData.name.replace(/\s+/g, '_')}.pdf`;
      link.click();
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Error generating resume. Please try again.');
    }
  };

  return (
    <div className="build-resume-container">
      <div className="build-resume-content">
        <h1 className="build-resume-title">
          <FiEdit2 className="title-icon" /> Build Your Professional Resume
        </h1>

        <form onSubmit={handleSubmit} className="build-resume-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h2 className="section-title"><FiUser className="section-icon" /> Personal Information</h2>
            <div className="input-grid">
              <InputField icon={<FiUser />} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
              <InputField icon={<FiMail />} name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
              <InputField icon={<FiPhone />} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
              <InputField icon={<FiMapPin />} name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            </div>
          </div>

          {/* Education Section */}
          <div className="form-section">
            <h2 className="section-title"><FiBook className="section-icon" /> Education</h2>
            <TextAreaField 
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Enter each education entry on a new line in format: Degree, University, Year\nExample: BSc Computer Science, MIT, 2020"
              rows={4}
            />
          </div>

          {/* Experience Section */}
          <div className="form-section">
            <h2 className="section-title"><FiBriefcase className="section-icon" /> Work Experience</h2>
            <TextAreaField 
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Enter each experience entry on a new line in format: Company, Role, Duration\nExample: Google, Software Engineer, 2018-2020"
              rows={4}
            />
          </div>

          {/* Skills Section */}
          <div className="form-section">
            <h2 className="section-title"><FiAward className="section-icon" /> Skills</h2>
            <TextAreaField 
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="List your skills separated by commas\nExample: JavaScript, React, Node.js, Python"
              rows={2}
            />
          </div>

          {/* Template Selection */}
          <div className="form-section">
            <h2 className="section-title">Choose Template</h2>
            <div className="template-options">
              {['basic', 'professional', 'creative'].map(template => (
                <label key={template} className="template-option">
                  <input
                    type="radio"
                    name="template"
                    value={template}
                    checked={formData.template === template}
                    onChange={handleChange}
                  />
                  <div className="template-card">
                    <div className={`template-preview ${template}`}></div>
                    <span>{template.charAt(0).toUpperCase() + template.slice(1)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="generate-button">
            <FiDownload className="button-icon" /> Generate Resume PDF
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ icon, name, placeholder, value, onChange }) => (
  <div className="input-field">
    <div className="input-icon">{icon}</div>
    <input
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

// Reusable TextArea Component
const TextAreaField = ({ name, value, onChange, placeholder, rows }) => (
  <div className="textarea-field">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
    />
  </div>
);

export default ResumeForm;
