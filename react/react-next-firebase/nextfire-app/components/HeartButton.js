import { firestore, auth, increment } from '../lib/firebase'
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore'

// Allows user to heart or like a post
export default function HeartButton({ postRef }) {
  // Listen to heart document for currently logged in user
  const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid)

  // using heartDoc.exists didn't end up working
  // const [heartDoc] = useDocument(heartRef)
  // useDocumentData() should return null/undefined if the document doesn't have data, which should work
  const [heart] = useDocumentData(heartRef)

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid
    const batch = firestore.batch()

    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid })

    await batch.commit()
  }

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = firestore.batch()

    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)

    await batch.commit()
  }

  return heart ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  )
}
