import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { useContext, useState, useEffect, useCallback } from 'react'
import { UserContext } from '../lib/context'
import Metatags from '../components/Metatags'
import debounce from 'lodash.debounce'

export default function Enter() {
  const { user, username } = useContext(UserContext)

  const Content = () => {
    if (!user) {
      return <SignInButton />
    }

    if (!username) {
      return <UsernameForm />
    }

    return <SignOutButton />
  }

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      <Metatags title="Enter" description="Sign up for this amazing app!" />
      <Content />
    </main>
  )
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider)
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={'/google.png'} alt="google" width="30px" /> Sign in with Google
    </button>
  )
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  const onSubmit = async e => {
    e.preventDefault()

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = firestore.batch()
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    })
    batch.set(usernameDoc, { uid: user.uid })

    await batch.commit()
  }

  const onChange = e => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  //

  useEffect(() => {
    checkUsername(formValue)
  }, [checkUsername, formValue])

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  if (username) {
    return undefined
  }

  return (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="myname"
          value={formValue}
          onChange={onChange}
        />
        <UsernameMessage
          username={formValue}
          isValid={isValid}
          loading={loading}
        />
        <button type="submit" className="btn-green" disabled={!isValid}>
          Choose
        </button>

        <h3>Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div>
      </form>
    </section>
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>
  } else {
    return <p></p>
  }
}
