import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
const baseUrl = 'http://localhost:4000'
import { AppHeader, AppSidebar } from '../../../components'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'

export default function Consults() {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [skills, setSkills] = useState('')
  const [message, setMessage] = useState('')
  const [consult, setConsult] = useState([])
  const [price, setPrice] = useState('')
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')
  const [company, setCompany] = useState('')
  const [discription, setDiscription] = useState('')

  const onFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    // console.log(name,email,skills,experience ,file)

    if (!file || !name || !email || !skills || !experience) {
      setMessage('Please fill out all fields.')
      return
    }

    const formData = new FormData()
    formData.append('image', file)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('experience', experience)
    formData.append('skills', skills)
    formData.append('price', price)
    formData.append('education', education)
    formData.append('company', company)
    formData.append('discription', discription)
    console.log(formData)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('Token not found')
        return
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/consult/createConsult`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Important: Let axios set the Content-Type for multipart/form-data automatically
          },
        },
      )

      setMessage('File uploaded: ' + res.data.fileName)
      window.location.reload() // Optional: Reload after successful upload
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setMessage('No file selected or bad request')
      } else {
        setMessage('Error uploading file')
      }
    }
  }

  // get api

  useEffect(() => {
    const fetchConsults = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token not found')
          return
        }
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/consult/getConsultall`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // console.log(response.data, "fghj");
        setConsult(response.data.consults)
        console.log(response.data.consults)
      } catch (err) {
        setError(err.message || 'Unexpected Error')
      }
    }

    fetchConsults()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token not found')
      return
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/delete-consult/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log(response.data.message)
      // window.location.reload()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Experience',
        // accessorFn: (dataRow) => new Date(dataRow.date).toDateString(),
        accessorKey: 'experience',
      },
      {
        header: 'Price',
        accessorKey: 'price',
      },
      {
        header: 'Delete',
        accessorFn: (dataRow) => (
          <CIcon icon={cilTrash} onClick={() => handleDelete(dataRow._id)} />
        ),
      },
    ],
    [],
  )

  const table = useMantineReactTable({
    columns,
    data: consult,
    enableRowSelection: false,
    enableColumnOrdering: false,
    enableGlobalFilter: true,
  })

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="mt-1 mx-3">
            <h1>Add Consults</h1>
            <form onSubmit={onSubmit}>
              <input className="form-control" type="file" name="image" onChange={onFileChange} />
              <input
                className="form-control mt-3"
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="form-control mt-3"
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                className="form-control mt-3"
                type="text"
                name="skills"
                placeholder="Enter Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <input
                className="form-control mt-3"
                type="number"
                placeholder="Enter Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
              <input
                className="form-control mt-3"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <input
                className="form-control mt-3"
                type="text"
                placeholder="Education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              />

              <input
                className="form-control mt-3"
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

              <textarea
                className="form-control mt-3"
                type="text"
                placeholder="discription"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
              />

              <input
                className="form-control bg-primary text-white w-25 mt-3"
                type="submit"
                value="Upload"
              />
            </form>
            {message && <p>{message}</p>}

            <div className="mt-5 mx-3">
              <h4 className="mb-2">Consults Lists</h4>
              <MantineReactTable table={table} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
