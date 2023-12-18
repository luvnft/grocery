import React, { useCallback, useState, FormEvent } from 'react';


interface EmailConfirmationFormProps {
    dismissModal: () => void;
    onEmailCofirm: (email: string) => void;
    isVisible: boolean;
}

const EmailConfirmationForm: React.FC<EmailConfirmationFormProps> = ({ onEmailCofirm, dismissModal, isVisible }) => {
    const [email, setEmail] = useState<string>('');

    const confirmEmail = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onEmailCofirm(email);
    }, [onEmailCofirm, email]);
    
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="bg-spilltCreme p-6 rounded p-20 rounded-3xl" onSubmit={confirmEmail}>
                <div className="mb-4">
                    <input 
                        placeholder='Email'
                        type="email" 
                        id="email" 
                        name="email" 
                        required={isVisible}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white rounded-full w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>
                <div className='flex flex-col space-y-2'>
                    <button type="submit" className="font-PermanentMarker text-white bg-spilltNavy py-1.5 px-4 rounded-full">
                        Confirm Email
                    </button>
                    <button onClick={dismissModal} className="font-PermanentMarker text-spilltNavy border-2 border-spilltNavy bg-white py-1.5 px-4 rounded-full">
                        Never Mind!
                    </button>
                </div>
            </form>
        </div>
    );
};
export default EmailConfirmationForm;