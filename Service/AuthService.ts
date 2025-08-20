import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role_id: number;
  status: number;
  image: string | null;
  mobile: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  static login = async (email: string, password: string): Promise<LoginResponse> => {
    if (!email.trim() || !password.trim()) {
      throw new Error('Please enter your username/email and password.');
    }

    const formBody = new URLSearchParams({
      username: email,
      password: password,
    }).toString();

    try {
      const response = await fetch('https://dewan-chemicals.majesticsofts.com/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });

      const responseBody = await response.json();

      if (response.ok && responseBody.token) {
        const token: string = responseBody.token;
        const userData: User = responseBody.user;

        // Store token and user data
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        console.log('Login Successful! User Data stored in AsyncStorage:', userData);

        return { token, user: userData };
      } else {
        let errorMessage = 'Login failed. Please check your credentials.';
        if (responseBody.message) {
          errorMessage = responseBody.message;
        } else if (responseBody.errors) {
          errorMessage = Object.values(responseBody.errors)
            .map((e: any) => (Array.isArray(e) ? e.join(', ') : e))
            .join('\n');
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Could not connect to the server. Please try again later.');
    }
  };

  static logout = async (): Promise<void> => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  };

  static getCurrentUser = async (): Promise<User | null> => {
    const storedUser = await AsyncStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) as User : null;
  };
}

export default AuthService;
