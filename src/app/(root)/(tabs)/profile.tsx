import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@clerk/expo'
import { useRouter } from 'expo-router'

export default function profile() {
  const router = useRouter()

  const { signOut } = useAuth()
  
  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/sign-in') 
    } catch (error) {
      console.error('Error signing out:', error)
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Profile</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        className="w-full bg-red-500 rounded-xl py-4 items-center"
      >
        <Text className="text-white font-bold text-lg">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}