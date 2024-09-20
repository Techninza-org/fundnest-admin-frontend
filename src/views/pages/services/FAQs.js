import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppSidebar, AppHeader } from '../../../components/index'
const baseUrl = 'http://localhost:4000'

const FAQs = () => {
  const [faqs, setFaqs] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token not found')
          return
        }
        const res = await axios.get(`${baseUrl}/admin/faqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setFaqs(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchFaqs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }
      const res = await axios.post(
        `${baseUrl}/admin/faqs`,
        { question, answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setFaqs([...faqs, res.data])
      setQuestion('')
      setAnswer('')
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="mt-1 mx-3">
            <h1>Create FAQs</h1>
            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="question">Question:</label>
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
                <label htmlFor="answer">Answer:</label>
                <input
                  type="text"
                  className="form-control"
                  id="answer"
                  name="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              </div>
              <div className="mt-5">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
            <div className="mt-5">
              <h1>All FAQs</h1>
              <div className="row">
                {faqs.map((faq, index) => (
                  <div key={index} className="col-12 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Question: {faq.question}</h5>
                        <p className="card-text">Answer: {faq.answer}</p>
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
  )
}

export default FAQs
