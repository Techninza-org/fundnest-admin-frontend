import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppSidebar, AppHeader } from '../../../components/index'

const baseUrl = 'http://localhost:4000'
const Webinars = () => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')
  const [message, setMessage] = useState('')
  const [videos, setVideos] = useState([])
  const [date, setDate] = useState(new Date())

  const onFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('video', file)
    formData.append('title', title) // Append the title
    formData.append('description', description) // Append the description
    formData.append('cost', cost) // Append the cost
    formData.append('date', date) // Append the date

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }
      const res = await axios.post(`${baseUrl}/videos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessage('File uploaded: ' + res.data.fileName)
      window.location.reload()
    } catch (err) {
      if (err.response.status === 400) {
        setMessage('No file selected')
      } else {
        setMessage('Error uploading file')
      }
    }
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token not found')
          return
        }
        const res = await axios.get(`${baseUrl}/videos/get-uploads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setVideos(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchVideos()
  }, [])

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="mt-1 mx-3">
            <h1>Upload a Webinar Video</h1>
            <form onSubmit={onSubmit}>
              <input className="form-control" type="file" name="video" onChange={onFileChange} />

              <input
                className="form-control mt-3"
                type="text"
                name="title"
                placeholder="Webinar Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="form-control mt-3"
                name="description"
                placeholder="Webinar Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <input
                className="form-control mt-3"
                type="number"
                name="cost"
                placeholder="Webinar Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />

              <input
                className="form-control mt-3"
                type="date"
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                className="form-control bg-primary text-white w-25 mt-3"
                type="submit"
                value="Upload"
              />
            </form>
            {message && <p>{message}</p>}

            <h1>Uploaded Videos</h1>
            <div className="row">
              {videos &&
                videos.map((video, index) => (
                  <div className="col-md-4 mt-5" key={index}>
                    <div>
                      <video width="320" height="240" controls>
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <h5>{video.title}</h5>
                      <p>{video.description}</p>
                      <p>Cost: {video.cost}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Webinars
