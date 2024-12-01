import { redirect } from "next/navigation";
import { verifyUser } from "../_lib/actions";

export default async function Profile() {
    let user = await verifyUser()


    if(!user) {
        return redirect('/login')
    }

    
    return (
        <div className="flex flex-col items-center bg-gray-900 text-gray-200 p-8 rounded-lg shadow-md max-w-md mx-auto">
            <img
                className="w-32 h-32 rounded-full border-4 border-purple-500 mb-4"
                src="https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-256.png"
            />
            <h1 className="text-2xl font-bold text-purple-400">John Doe</h1>
            <p className="mt-2 text-gray-400 text-center">
                A brief description or tagline can go here to complement the profile.
            </p>
        </div>
    );
}
