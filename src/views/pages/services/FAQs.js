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

  // Handle thumbnail file selection
  const onThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  useEffect(() => {
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
        // Ensure the response is treated as an array
        setFaqs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      const formData = new FormData();
      formData.append('question', question);
      formData.append('answer', answer);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/faqs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update FAQs state with the newly added FAQ
      setFaqs((prevFaqs) => [...prevFaqs, res.data]);
      setQuestion('');
      setAnswer('');
      setThumbnail(null);
    } catch (err) {
      console.error(err);
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
      console.log("Deleted card");

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
                  className="form-control"
                  id="question"
                  name="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="answer">Blog Description:</label>
                <textarea
                  className="form-control"
                  id="answer"
                  name="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                ></textarea>

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

              <div className="mt-5">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>

            <div className="mt-5">
              <h1>All Blog Post</h1>
              <div className="row">
                {faqs.map((faq, index) => (
                  <div key={index} className="col-12 mb-3">
                    <div className="card px-3">
                      <div className="row g-0">
                        <div className="col">
                          <div className="card-body">
                            <h5 className="card-title">Blog Title: {faq.question}</h5>
                            <p className="card-text">Blog Description: {faq.answer}</p>
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
