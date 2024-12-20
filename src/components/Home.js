import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room Id is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both the field is requried");
      return;
    }

    // redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("room is created");
  };

  // when enter then also join
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homepage">
      <div className=" d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6 text-center d-flex flex-column justify-content-center align-items-center">
          <h1 className="mb-5">Talk Live</h1>
          <p className=" w-75 text-gradiant">
            {" "}
            Welcome to Talk Live, the ultimate solution for seamless technical
            interviews. It features a live code editor for collaborative coding
            on a shared screen, coupled with 1:1 video call support .
          </p>
          <img
            src="/images/videocall.jpeg"
            alt="Logo"
            className="img-fluid rounded"
            style={{ maxWidth: "400px" }}
          />
        </div>

        {/* Card Component Column */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm bg-secondary rounded ">
            <div className="card-body text-center bg-dark gap-3 vh-100 d-flex flex-column justify-content-center align-items-center">
              {/* <img
            src="/images/codecast.png"
            alt="Logo"
            className="img-fluid mx-auto d-block"
            style={{ maxWidth: "150px" }}
          /> */}
              <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>

              <div className="form-group ">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="form-control mb-2"
                  placeholder="ROOM ID"
                  onKeyUp={handleInputEnter}
                />
              </div>

              {/* USERNAME Input */}
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control mb-2"
                  placeholder="USERNAME"
                  onKeyUp={handleInputEnter}
                />
              </div>

              {/* Join Room Button */}
              <button
                onClick={joinRoom}
                className="btn btn-success btn-lg btn-block"
              >
                JOIN
              </button>

              {/* Generate Room Link */}
              <p className="mt-3 text-light">
                Randomly Create Unique Id - {" "}
                <span
                  onClick={generateRoomId}
                  className="text-success p-2"
                  style={{ cursor: "pointer" }}
                >
                  Create
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
