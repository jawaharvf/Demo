import { useAuth, useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { View, Image, ScrollView, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'

export default function SignUp() {

  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()

  const router = useRouter();

  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ code, setCode ] = useState('')

  const isLoading = fetchStatus === "fetching";

    if (signUp.status === "complete" && isSignedIn) {
      return null;
    }

  const onSignUpPress = async () => {
  const { error } = await signUp.password ({
      emailAddress: email,
      password,
      firstName,
      lastName
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();

  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({ 
      code, 
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/(root)/(tabs)");
          router.replace(url as any);
        },
      });
    }
  };

  if(
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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
              Varify
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signUp.verifications.sendEmailCode()}
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
            Create account
          </Text>
          <Text className="text-gray-600 mb-6">
            Find your dream home today
          </Text>

          <View className="flex-row gap-3 mb-4">
            <TextInput
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
              placeholder="First Name"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <TextInput
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

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
            {errors.fields.emailAddress && (
              <Text className="text-red-500 mb-4">
                {errors.fields.emailAddress.message}
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
            onPress={onSignUpPress}
            disabled={isLoading}
            className="w-full bg-blue-600 rounded-xl py-4 items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/sign-in">
              <Text className="text-blue-600 font-semibold ml-1">Sign In</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" />
        </View>
    </ScrollView>
  );
}
