import { useState } from 'react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="grid grid-cols-1 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="section-title mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-primary-600 text-xl">📞</div>
                <div>
                  <p className="font-medium">+251 11 111 1111</p>
                  <p className="text-gray-600">Mon-Fri 2:30am-5:30pm EAT</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-primary-600 text-xl">✉️</div>
                <div>
                  <p className="font-medium">support@scrpp.gov.et</p>
                  <p className="text-gray-600">General inquiries</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-primary-600 text-xl">📍</div>
                <div>
                  <p className="font-medium">Bahir Dar, Ethiopia</p>
                  <p className="text-gray-600">Headquarters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="card">
              <div className="card-body">
                <h3 className="mb-6">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Your Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />

                  <Input
                    label="Subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />

                  <div className="input-group">
                    <label className="input-label">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="input-field"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="btn-full"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact