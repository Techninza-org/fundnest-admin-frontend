import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppSidebar, AppHeader } from '../../../components/index';

const baseUrl = 'http://localhost:4000';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState('');

  // New fields for meta data
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDiscription, setMetaDiscription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const [formErrors, setFormErrors] = useState({}); // Store form errors

  // Handle thumbnail file selection
  const onThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFaqs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // Form validation logic
  const validateForm = () => {
    const errors = {};
    if (!question.trim()) errors.question = 'Blog title is required';
    if (!answer.trim()) errors.answer = 'Blog description is required';
    if (!metaTitle.trim()) errors.metaTitle = 'Meta title is required';
    if (!metaDiscription.trim()) errors.metaDiscription = 'Meta description is required';
    if (!metaKeywords.trim()) errors.metaKeywords = 'Meta keywords are required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      const formData = new FormData();
      formData.append('question', question);
      formData.append('answer', answer);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDiscription', metaDiscription);
      formData.append('metaKeywords', metaKeywords);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/faqs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form fields after successful submission
      setQuestion('');
      setAnswer('');
      setMetaTitle('');
      setMetaDiscription('');
      setMetaKeywords('');
      setThumbnail(null);
      setFormErrors({}); // Clear errors after successful submission
      setMessage('Blog post created successfully!');

      // Fetch FAQs again after posting
      fetchFaqs();
    } catch (err) {
      console.error(err);
      setMessage('Error creating blog post');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/delete-blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Deleted card');

      // Update the FAQs state to remove the deleted FAQ
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== id));
      setMessage('FAQ deleted successfully');
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      setMessage('Error deleting FAQ');
    }
  };

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        {message && <div className="alert alert-info">{message}</div>}
        <div className="body flex-grow-1">
          <div className="mt-1 mx-3">
            <h1>Create Blog</h1>
            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="question">Blog Title:</label>
                <input
                  type="text"
                  className={`form-control ${formErrors.question ? 'is-invalid' : ''}`}
                  id="question"
                  name="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
                {formErrors.question && <div className="invalid-feedback">{formErrors.question}</div>}
              </div>

              <div className="form-group mt-3">
                <label htmlFor="answer">Blog Description:</label>
                <textarea
                  className={`form-control ${formErrors.answer ? 'is-invalid' : ''}`}
                  id="answer"
                  name="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                ></textarea>
                {formErrors.answer && <div className="invalid-feedback">{formErrors.answer}</div>}

                <div>
                  <label className="form-label mt-3">Select Thumbnail Image</label>
                  <input
                    className="form-control"
                    type="file"
                    name="thumbnail"
                    onChange={onThumbnailChange}
                  />
                  {!thumbnail && (
                    <small className="form-text text-muted">
                      Please select a thumbnail image to upload
                    </small>
                  )}
                </div>
              </div>

              {/* Meta fields */}
              <div className="form-group mt-3">
                <label htmlFor="metaTitle">Meta Title:</label>
                <input
                  type="text"
                  className={`form-control ${formErrors.metaTitle ? 'is-invalid' : ''}`}
                  id="metaTitle"
                  name="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  required
                />
                {formErrors.metaTitle && <div className="invalid-feedback">{formErrors.metaTitle}</div>}
              </div>

              <div className="form-group mt-3">
                <label htmlFor="metaDiscription">Meta Description:</label>
                <textarea
                  className={`form-control ${formErrors.metaDiscription ? 'is-invalid' : ''}`}
                  id="metaDiscription"
                  name="metaDiscription"
                  value={metaDiscription}
                  onChange={(e) => setMetaDiscription(e.target.value)}
                  required
                ></textarea>
                {formErrors.metaDiscription && <div className="invalid-feedback">{formErrors.metaDiscription}</div>}
              </div>

              <div className="form-group mt-3">
                <label htmlFor="metaKeywords">Meta Keywords:</label>
                <input
                  type="text"
                  className={`form-control ${formErrors.metaKeywords ? 'is-invalid' : ''}`}
                  id="metaKeywords"
                  name="metaKeywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  required
                />
                {formErrors.metaKeywords && <div className="invalid-feedback">{formErrors.metaKeywords}</div>}
              </div>

              <div className="mt-5">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>

            <div className="mt-5">
              <h1>All Blog Posts</h1>
              <div className="row">
                {faqs.map((faq, index) => (
                  <div key={index} className="col-12 mb-3">
                    <div className="card px-3">
                      <div className="row g-0">
                        <div className="col">
                          <div className="card-body">
                            <h5 className="card-title">Blog Title: {faq.question}</h5>
                            <p className="card-text">Blog Description: {faq.answer}</p>
                            <p className="card-text">Meta Title: {faq.metaTitle}</p>
                            <p className="card-text">Meta Description: {faq.metaDiscription}</p>
                            <p className="card-text">Meta Keywords: {faq.metaKeywords}</p>
                            {faq.thumbnail && (
                              <img
                                src={`${baseUrl}/uploads/${faq.thumbnail}`}
                                alt="FAQ Thumbnail"
                                className="img-fluid"
                                style={{ maxHeight: '200px' }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                          <button className="btn btn-danger" onClick={() => handleDelete(faq._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQs;
