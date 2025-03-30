import './ProgressIcon.css'
// import { useNavigate } from 'react-router-dom'

const ProgressIcon = ({ value, label, link, colorName }) => {
  const navigate = useNavigate()
  const setColor = (color) => {
    switch (color) {
      case 'orange':
        return '#f84c1c'
      case 'blue':
        return '#007bff'
      case 'green':
        return '#28a745'
      case 'red':
        return '#dc3545'
      default:
        return '#f84c1c'
    }
  }

  return (
    
    <div class="main row d-flex justify-content-center mt-100">

      <div class="col-md-6">
        <div class="progress ">
          <span class="progress-left">
            <span class="progress-bar" style={{borderColor: setColor(colorName)}}></span>
          </span>
          <span class="progress-right">
            <span class="progress-bar" style={{borderColor: setColor(colorName)}}></span>
          </span>
          <div class="progress-value">{value}</div>

        </div>

        

        <span className='badge progress-label' 
        style={{borderTop: `solid 7px ${setColor(colorName)}`}}
        onClick={()=>navigate(link)}>
          <span className='triangle' content='' style={{background: setColor(colorName)}}>       
          </span>
          {label}
        </span>
      </div>
      
    </div>
  )
}

export default ProgressIcon	  