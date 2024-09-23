import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppSidebar, AppHeader } from '../../../components/index'

const baseUrl = 'http://localhost:4000'

const MyCourse = () => {
  const [file, setFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null) // State for thumbnail
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')
  const [message, setMessage] = useState('')
  const [videos, setVideos] = useState([])

  // Handle video file selection
  const onFileChange = (e) => {
    setFile(e.target.files[0])
  }

  // Handle thumbnail file selection
  const onThumbnailChange = (e) => {
    setThumbnail(e.target.files[0])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('video', file)
    formData.append('thumbnail', thumbnail) // Append the thumbnail
    formData.append('title', title) // Append the title
    formData.append('description', description) // Append the description
    formData.append('cost', cost) // Append the cost

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token not found')
        return
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/videos/create-courses`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      console.log(res)
      setMessage('File uploaded successfully')
      window.location.reload() // Refresh page after upload
    } catch (err) {
      if (err.response.status === 400) {
        setMessage('No file selected')
      } else {
        setMessage('Error uploading file')
      }
    }
  }

  // Fetch uploaded videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token not found')
          return
        }
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/videos/get-courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setVideos(res.data.courses) // Update to use res.data.courses
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
              <div>
                <label className="form-label">Select Video File</label>
                <input className="form-control" type="file" name="video" onChange={onFileChange} />
                {!file && (
                  <small className="form-text text-muted">
                    Please select a video file to upload
                  </small>
                )}
              </div>
              <div>
                <label className="form-label mt-3">Select Thumbnail Image</label>
                <input
                  className="form-control"
                  type="file"
                  name="thumbnail"
                  onChange={onThumbnailChange}
                />{' '}
                {/* Thumbnail input */}
                {!thumbnail && (
                  <small className="form-text text-muted">
                    Please select a thumbnail image to upload
                  </small>
                )}
              </div>
              <input
                className="form-control mt-3"
                type="text"
                name="title"
                placeholder="Enter Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="form-control mt-3"
                name="description"
                placeholder="Enter Course Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <input
                className="form-control mt-3"
                type="number"
                name="cost"
                placeholder="Enter course price"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
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
                    <div className="card">
                      <img
                        src={`${baseUrl}${video.thumnailUrl}`}
                        alt="Thumbnail"
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{video.title}</h5>
                        <p className="card-text">{video.description}</p>
                        <p>Cost: ${video.cost}</p>

                        {/* <video width="320" height="240" controls>
                          <source src={video.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video> */}
                      </div>
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

export default MyCourse
