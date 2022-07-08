import {Text, View} from "../components/Themed";
import {KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {StackParamList} from "../navigation/GuestNavigator";
import useColorScheme from "../hooks/useColorScheme";
import {useState} from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../firebase";
import {doc, setDoc} from "firebase/firestore";

export default function SignInUp({navigation}: NativeStackScreenProps<StackParamList, 'Root'>) {
    const colorScheme = useColorScheme();
    const [email, setEmail] = useState('asdasdads@gmail.com');
    const [password, setPassword] = useState('adsasdda');
    const [userName, setUserName] = useState('Saddsa');
    const [isFetching, setFetching] = useState(false);
    const handleSignUp = async () => {
        if (email && password) {
            setFetching(true)
            try {
                await createUserWithEmailAndPassword(auth, email, password)
                await setDoc(doc(db, "users", auth.currentUser!.uid), {
                    name: userName,
                    email,
                });
            } catch (e) {
                const errorMessage = e.message;
                if (errorMessage) {
                    alert(e.message)
                }
            }
            setFetching(false)
        }
    }

    const handleLogin = async () => {
        if (email && password) {
            setFetching(true)
            try {
                await signInWithEmailAndPassword(auth, email, password)
            } catch (e) {
                const errorMessage = e.message;
                if (errorMessage) {
                    alert(e.message)
                }
            }
            setFetching(false)
        }
    }
    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={[styles.container, styles[colorScheme]]}
        >
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Hello🚀</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={userName}
                    onChangeText={text => setUserName(text)}
                    textContentType="username"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    textContentType="emailAddress"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    textContentType="password"
                />
            </View>
            <View style={buttonStyles.buttonContainer}>
                <TouchableOpacity
                    disabled={isFetching}
                    onPress={handleLogin}
                    style={
                        isFetching
                            ?
                            [buttonStyles.button, disableButton.button]
                            :
                            [buttonStyles.button, buttonTheme[colorScheme].button]
                    }
                >
                    <Text style={buttonStyles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={isFetching}
                    onPress={handleSignUp}
                    style={
                        isFetching
                            ?
                            [
                                buttonStyles.button,
                                buttonStyles.buttonOutline,
                                disableButton.buttonOutline,
                            ]
                            :
                            [
                                buttonStyles.button,
                                buttonStyles.buttonOutline,
                                buttonTheme[colorScheme].buttonOutline
                            ]
                    }
                >
                    <Text
                        style={
                            isFetching
                                ?
                                [
                                    buttonStyles.buttonOutlineText,
                                    disableButton.buttonOutlineText
                                ]
                                :
                                [
                                    buttonStyles.buttonOutlineText,
                                    buttonTheme[colorScheme].buttonOutlineText
                                ]
                        }
                    >
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dark: {
        backgroundColor: '#1D1E22',
    },
    light: {
        backgroundColor: '#fff',
    },
    inputContainer: {
        width: '80%'
    },
    title: {
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 0.5,
        borderColor: '#363849',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
});
const buttonStyles = StyleSheet.create({
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        fontWeight: '700',
        fontSize: 16,
    },
});

const buttonTheme = {
    dark: {
        button: {
            backgroundColor: '#5168F4',
        },
        buttonOutline: {
            borderColor: '#5168F4',
        },
        buttonOutlineText: {
            color: '#5168F4',
        },
    },
    light: {
        button: {
            backgroundColor: '#0782F9',
        },
        buttonOutline: {
            borderColor: '#0782F9',
        },
        buttonOutlineText: {
            color: '#0782F9',
        },
    }
};
const disableButton = {
    button: {
        backgroundColor: '#b5b5b5',
    },
    buttonOutline: {
        borderColor: '#b5b5b5',
    },
    buttonOutlineText: {
        color: '#b5b5b5',
    },
};
