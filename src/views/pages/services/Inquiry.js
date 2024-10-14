import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { AppSidebar, AppHeader } from '../../../components/index'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { Modal, Button } from '@mantine/core' // Add Mantine modal component

const Inquiry = () => {
  const [contacts, setContacts] = useState([])
  const [error, setError] = useState('')
  const [selectedDescription, setSelectedDescription] = useState('') // To hold the selected full description
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal state

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('Token not found')
          return
        }
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/get-contact`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setContacts(response.data)
      } catch (err) {
        setError(err.message || 'Unexpected Error')
      }
    }

    fetchContacts()
  }, [])

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token not found')
      return
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/deleteAppointment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log(response.data.message)
      window.location.reload()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description) // Set full description in state
    setIsModalOpen(true) // Open the modal
  }

  const columns = useMemo(
    () => [
      {
        header: 'Customer Name',
        accessorKey: 'name',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
      },
      {
        header: 'Created At',
        accessorFn: (dataRow) => new Date(dataRow.createdAt).toLocaleString(),
        accessorKey: 'createdAt',
      },
      {
        header: 'Type',
        accessorFn: (dataRow) => (dataRow.type === '1' ? 'Inquiry' : 'Services'),
        accessorKey: 'type',
      },
      {
        header: 'Description',
        accessorFn: (dataRow) => {
          const words = dataRow.description?.split(' ')
          const truncatedDescription = words?.slice(0, 3).join(' ') + (words?.length > 5 ? '...' : '')
          return (
            <span
              onClick={() => handleDescriptionClick(dataRow.description)} // Open modal with full description
              style={{ cursor: 'pointer',}}
            >
              {truncatedDescription==="undefined" ? '' : truncatedDescription}
            </span>
          )
        },
        accessorKey: 'description',
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
    data: contacts,
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
            <h4 className="mb-2">Contact Information</h4>
            <MantineReactTable table={table} />
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </div>

      {/* Modal for displaying full description */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Full Description"
        centered
      >
        <p>{selectedDescription}</p>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </Modal>
    </>
  )
}

export default Inquiry
