import { useAuth, useSignIn } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { View, Image, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'

export default function SignIn() {

  const { signIn, errors, fetchStatus } = useSignIn()

  const router = useRouter();

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ code, setCode ] = useState('')

  const isLoading = fetchStatus === "fetching";

  const onSignInPress = async () => {
     const { error } = await signIn.password ({
      emailAddress: email,
      password,  
    });

    if (error) {
      alert(error.message);
      return;
    }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            const url = decorateUrl("/(root)/(tabs)");
            router.replace(url as any);
          },
        });
      }

      else if (signIn.status === "needs_second_factor") {
        await signIn.mfa.sendPhoneCode();
      }

      else if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors.find(factor => factor.strategy === "email_code");
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }
      }

      else {
        console.error("sign-in attempt not complete:", signIn);
      }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/(root)/(tabs)");
          router.replace(url as any);
        },
      });
    }
  };

  if(signIn.status === "needs_client_trust") {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image 
          source={require('../../../assets/images/demo-logo.png')}
          className="w-32 h-16 mb-6"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Verify your account{" "}
        </Text>
        <Text className="text-gray-600 mb-6">
          We sent a code to {email}
        </Text>

        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4"
          placeholder="Enter verification code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        {errors.fields.code && (
          <Text className="text-red-500 mb-4">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-blue-600 rounded-xl py-4 items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Verify
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signIn.mfa.sendEmailCode()}
          className="py-2"
        >
          <Text className="text-blue-600">
            I need a new code
          </Text> 
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
        <View className="flex-1 justify-center px-6 py-12">
          <Image 
            source={require('../../../assets/images/demo-logo.png')}
            className="w-32 h-16 mb-6"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back
          </Text>
          <Text className="text-gray-600 mb-6">
            Signin to your account
          </Text>

          <View className="mb-4">
            <TextInput
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.fields.identifier && (
              <Text className="text-red-500 mb-4">
                {errors.fields.identifier.message}
              </Text>
            )}
          </View>

          <View className="mb-6">
            <TextInput
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors.fields.password && (
              <Text className="text-red-500 mb-4">
                {errors.fields.password.message}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading}
            className="w-full bg-blue-600 rounded-xl py-4 items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Sign in
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Dont't have an account? </Text>
            <Link href="/sign-up">
              <Text className="text-blue-600 font-semibold ml-1">Sign Up</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
    </ScrollView>
  );
}
