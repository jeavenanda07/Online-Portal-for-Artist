import { FaRegCommentAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import ProfileIcon from '../ui/ProfileIcon';
import userProfile from "@/data/user_profile.json"

interface Props {
    id: string;
    commentedById: string;
    commentedToId: string;
    postId: string | null;
    artworkId: string | null;
    commentText: string;
    lastEdited: string;
  }

const Comments = ({
    id,
    commentedById,
    commentedToId,
    postId,
    artworkId,
    commentText,
    lastEdited
}: Props) => {
  const user = userProfile.find(u => u.id == commentedById);
  console.log(user?.username);
 
  return (
    <div className='flex gap-4 text-sm'>
        {/* <ProfileIcon username=""/> */}

        <div className='flex flex-col gap-2 w-[90%]'>
            <div className='bg-primary border-2 border-primary-line p-4 rounded-md flex flex-col gap-2'>
                <h4 className='font-bold'>{user?.username} <span className='font-light opacity-50 ml-2'>{lastEdited}</span></h4>
                <p>{commentText}</p>
            </div>

            <div className='flex items-center gap-4 ml-4'>
                <div className='flex items-center gap-2'>
                    <FaRegHeart />
                    <p></p>
                </div>
            </div>
        </div>  
    </div>
  )
}

export default Comments
