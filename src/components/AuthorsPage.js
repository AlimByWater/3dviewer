import { useState, useEffect } from 'react'
import './AuthorsPage.css'
import { objects } from '../data'
import { postEvent, on, useLaunchParams } from '@telegram-apps/sdk-react'

const getUniqueAuthors = () => {
  const uniqueAuthors = objects.reduce((acc, obj) => {
    if (!acc.find((item) => item.author === obj.author)) {
      acc.push({
        author: obj.author,
        logo: obj.logo,
        channel: obj.channel
      })
    }
    return acc
  }, [])
  return uniqueAuthors
}

const getAuthorWorks = (authorName) => {
  return objects.filter((obj) => obj.author === authorName)
}

const AuthorsPage = ({ onClose }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [safeAreaInsets, setSafeAreaInsets] = useState({ top: 0, left: 0, right: 0, bottom: 0 })
  const authors = getUniqueAuthors()
  const lp = useLaunchParams()

  useEffect(() => {
    // Request initial safe area values
    postEvent('web_app_request_content_safe_area')

    // Listen for safe area changes
    const removeListener = on('content_safe_area_changed', (payload) => {
      setSafeAreaInsets({
        top: payload.top || 0,
        left: payload.left || 0,
        right: payload.right || 0,
        bottom: payload.bottom || 0
      })
    })

    // Cleanup listener on unmount
    return () => removeListener()
  }, [])

  const pageStyle = {
    padding: `calc(${safeAreaInsets.top}px + 40px) calc(${safeAreaInsets.right}px + 40px) calc(${safeAreaInsets.bottom}px + 40px) calc(${safeAreaInsets.left}px + 40px)`
  }

  const closeButtonStyle = {
    top: `calc(${safeAreaInsets.top}px + 20px)`,
    right: `calc(${safeAreaInsets.right}px + 20px)`
  }

  const backButtonStyle = {
    top: `calc(${safeAreaInsets.top}px + 20px)`,
    left: `calc(${safeAreaInsets.left}px + 20px)`
  }

  if (['android', 'android_x', 'ios'].includes(lp.platform)) {
    // pageStyle.top = `calc(${safeAreaInsets.top}px + 60px)`
    closeButtonStyle.top = `calc(${safeAreaInsets.top}px + 40px)`
    backButtonStyle.top = `calc(${safeAreaInsets.top}px + 40px)`
  }

  const handleAuthorClick = (author) => {
    setSelectedAuthor(author)
  }

  const handleBack = () => {
    setSelectedAuthor(null)
  }

  if (selectedAuthor) {
    const works = getAuthorWorks(selectedAuthor.author)
    return (
      <div className="authors-page" style={pageStyle}>
        <button className="close-button" onClick={onClose} style={closeButtonStyle}>
          ×
        </button>
        <button className="back-button" onClick={handleBack} style={backButtonStyle}>
          ←
        </button>
        <div className="author-header">
          <img src={selectedAuthor.logo} alt={selectedAuthor.author} className="author-header-logo" />
          <h2 className="author-header-name">{selectedAuthor.author}</h2>
          <a href={selectedAuthor.channel} className="author-channel-link" target="_blank" rel="noopener noreferrer">
            Channel →
          </a>
        </div>
        <div className="works-grid">
          {works.map((work) => (
            <div key={work.id} className="work-card" onClick={() => onClose(work.id)}>
              <img src={work.previewImage} alt={work.name} className="work-preview" />
              <div className="work-info">
                <h3 className="work-name">{work.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="authors-page" style={pageStyle}>
      <button className="close-button" onClick={onClose} style={closeButtonStyle}>
        ×
      </button>
      <div className="authors-list">
        {authors.map((author, index) => (
          <div key={index} className="author-list-item" onClick={() => handleAuthorClick(author)}>
            <img src={author.logo} alt={author.author} className="author-list-logo" />
            <div className="author-list-name">{author.author}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AuthorsPage
export { getUniqueAuthors }
