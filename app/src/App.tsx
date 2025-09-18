import { Toaster } from 'react-hot-toast'
import AppRouter from './AppRouter'

function App() {

  return (
    <>
      <Toaster
        position="bottom-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff'
          },
        }}
      />
    <AppRouter/>
    </>
  )
}

export default App
