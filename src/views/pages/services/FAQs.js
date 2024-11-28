import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppSidebar, AppHeader } from '../../../components/index'
import { Modal, Button } from 'react-bootstrap'
import MarkdownEditor from '@uiw/react-markdown-editor'
import Markdown from 'markdown-to-jsx'
import ReactDOMServer from 'react-dom/server'

const baseUrl = 'http://localhost:4000'

const FAQs = () => {
  // const [content, setContent] = useState('');
  const [faqs, setFaqs] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [message, setMessage] = useState('')

  // New fields for meta data
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDiscription, setMetaDiscription] = useState('')
  const [metaKeywords, setMetaKeywords] = useState('')

  const [formErrors, setFormErrors] = useState({}) // Store form errors

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [currentFaqId, setCurrentFaqId] = useState(null)

  // Handle modal inputs
  const [modalQuestion, setModalQuestion] = useState('')
  const [modalAnswer, setModalAnswer] = useState('')
  const [modalMetaTitle, setModalMetaTitle] = useState('')
  const [modalMetaDiscription, setModalMetaDiscription] = useState('')
  const [modalMetaKeywords, setModalMetaKeywords] = useState('')

  // Handle thumbnail file selection
  const onThumbnailChange = (e) => {
    setThumbnail(e.target.files[0])
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/blog`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setFaqs(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkdownChange = (answer) => {
    setAnswer(answer)
  }

  const convertMarkdownToString = (markdownText) => {
    const jsxElement = <Markdown>{markdownText}</Markdown>
    const jsxString = ReactDOMServer.renderToStaticMarkup(jsxElement)
    return jsxString
  }

  // Form validation logic
  const validateForm = () => {
    const errors = {};
    if (!question.trim()) errors.question = 'Blog title is required';
    if (!answer.trim()) errors.answer = 'Blog description is required';
    if (!metaTitle.trim()) errors.metaTitle = 'Meta title is required';
    if (!metaDiscription.trim()) errors.metaDiscription = 'Meta description is required';
    if (!metaKeywords.trim()) errors.metaKeywords = 'Meta keywords are required';
    if (!thumbnail) errors.thumbnail = 'Thumbnail image is required';

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return // Stop if validation fails
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }
      const editedAnswer = await convertMarkdownToString(answer)

      const formData = new FormData()
      formData.append('question', question)
      formData.append('answer', editedAnswer)
      formData.append('metaTitle', metaTitle)
      formData.append('metaDiscription', metaDiscription)
      formData.append('metaKeywords', metaKeywords)
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/faqs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(res, 'res')

      // Reset form fields after successful submission
      setQuestion('')
      setAnswer('')
      setMetaTitle('')
      setMetaDiscription('')
      setMetaKeywords('')
      setThumbnail(null)
      setFormErrors({}) // Clear errors after successful submission
      setMessage('Blog post created successfully!')

      // Fetch FAQs again after posting
      fetchFaqs()
    } catch (err) {
      console.error(err)
      setMessage('Error creating blog post')
    }
  }

  // Open modal with pre-filled values
  const handleEdit = (faq) => {
    setModalQuestion(faq.question)
    setModalAnswer(faq.answer)
    setModalMetaTitle(faq.metaTitle)
    setModalMetaDiscription(faq.metaDiscription)
    setModalMetaKeywords(faq.metaKeywords)
    setCurrentFaqId(faq._id)
    setShowModal(true)
  }

  const handleCloseModal = () => setShowModal(false)

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }

      const updatedData = {
        question: modalQuestion,
        answer: modalAnswer,
        metaTitle: modalMetaTitle,
        metaDescription: modalMetaDiscription,
        metaKeywords: modalMetaKeywords,
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/editBlog/${currentFaqId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      // Fetch FAQs again after updating
      fetchFaqs()
      setMessage('Blog post updated successfully!')
      handleCloseModal()
    } catch (err) {
      console.error(err)
      setMessage('Error updating blog post')
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }

      await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/delete-blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Deleted card')

      // Update the FAQs state to remove the deleted FAQ
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== id))
      setMessage('FAQ deleted successfully')
    } catch (err) {
      console.error('Error deleting FAQ:', err)
      setMessage('Error deleting FAQ')
    }
  }

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
                {formErrors.question && (
                  <div className="invalid-feedback">{formErrors.question}</div>
                )}
              </div>

              <div className="mt-3">
                <label htmlFor="answer" className="form-label">
                  Blog Description:
                </label>
                <MarkdownEditor
                  value={answer}
                  onChange={(value) => handleMarkdownChange(value)}
                  height={400}
                  className="z-10"
                />
              </div>
              <div>
                {formErrors.answer && <div className="invalid-feedback">{formErrors.answer}</div>}

                <div>
                  <label className="form-label mt-3">Select Thumbnail Image</label>
                  <input
                     className={`form-control ${formErrors.thumbnail ? 'is-invalid' : ''}`}
                    type="file"
                    name="thumbnail"
                    onChange={onThumbnailChange}
                  />
                  
                  {!thumbnail && (
                    <small className="form-text text-muted">
                      Please select a thumbnail image to upload
                    </small>
                  )}
                   {formErrors.thumbnail && <div className="invalid-feedback">{formErrors.thumbnail}</div>}
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
                {formErrors.metaTitle && (
                  <div className="invalid-feedback">{formErrors.metaTitle}</div>
                )}
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
                {formErrors.metaDiscription && (
                  <div className="invalid-feedback">{formErrors.metaDiscription}</div>
                )}
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
                {formErrors.metaKeywords && (
                  <div className="invalid-feedback">{formErrors.metaKeywords}</div>
                )}
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
                        <div className="col-auto d-flex align-items-center gap-2">
                          <button className="btn btn-primary" onClick={() => handleEdit(faq)}>
                            Edit
                          </button>
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
      {/* Modal for editing blog post */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="modalQuestion">Blog Title:</label>
              <input
                type="text"
                className="form-control"
                id="modalQuestion"
                value={modalQuestion}
                onChange={(e) => setModalQuestion(e.target.value)}
                required
              />
              {formErrors.question && <div className="invalid-feedback">{formErrors.question}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="answer" className="form-label">
                Blog Description:
              </label>
              <MarkdownEditor
                value={modalAnswer}
                onChange={(e) => setAnswer(e.target.value)}
                height={400}
                className="z-10"
              />
              {formErrors.answer && <div className="invalid-feedback">{formErrors.answer}</div>}
            </div>

            <div className="form-group mt-3">
              <label htmlFor="modalMetaTitle">Meta Title:</label>
              <input
                type="text"
                className="form-control"
                id="modalMetaTitle"
                value={modalMetaTitle}
                onChange={(e) => setModalMetaTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="modalMetaDiscription">Meta Description:</label>
              <textarea
                className="form-control"
                id="modalMetaDiscription"
                value={modalMetaDiscription}
                onChange={(e) => setModalMetaDiscription(e.target.value)}
                required
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="modalMetaKeywords">Meta Keywords:</label>
              <input
                type="text"
                className="form-control"
                id="modalMetaKeywords"
                value={modalMetaKeywords}
                onChange={(e) => setModalMetaKeywords(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="btn btn-primary mt-3">
              Update Blog
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default FAQs
