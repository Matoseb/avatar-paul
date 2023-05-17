import './style.css'
import { Avatar, modes } from './avatar.js'

const avatar = new Avatar({
  parent: document.querySelector('.avatar')
})

window.onmousemove = ({ clientX, clientY }) => {
  const amt = clientX / window.innerWidth
  avatar.modulate(amt) // valeur normalizée entre 0 et 1
  avatar.follow(clientX, clientY)
}

window.onclick = () => {
  avatar.setMode(modes.LISTEN)
}