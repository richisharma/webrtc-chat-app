import React from  "react"
import {Link} from "react-router-dom"

const Features = () => {
    return (
        <div>
            <h2>Features</h2>
            <Link to="/chat">
                <button>One-on-One Chat</button>
            </Link>
            <Link to="/chat-room">
                <button>Chat Room</button>
            </Link>
            <Link to="/video-call">
                <button>Video Call</button>
            </Link>
        </div>
    );
}

export default Features;