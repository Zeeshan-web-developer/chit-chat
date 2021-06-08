import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";

const URL = process.env.REACT_APP_WEBSOCKET_ENDPOINT;
const DOMAIN = process.env.REACT_APP_DEFAULT_DOMAIN;
const { client } = require("@xmpp/client");
const debug = require("@xmpp/debug");

function Login() {
  const history = useHistory();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [messageLogin, setMessageLogin] = useState("");
  let clientXmpp = client({
    service: URL,
    domain: DOMAIN,
    resource: "WebApp",
    username: userName,
    password: password,
    transport: "websocket",
  });
  const connect = () => {
    setMessageLogin("Starting conection...");
    if (userName === "" || password === "") {
      setMessageLogin("Username and password are required.");
    } else {
      doConnection();
    }
  };

  const doConnection = () => {
    console.log("ja");
    if (clientXmpp.status !== "online") {
      clientXmpp = client({
        service: URL,
        domain: DOMAIN,
        resource: "example",
        username: userName,
        password: password,
        transport: "websocket",
      });

      //debug(clientXmpp, true);

      clientXmpp.start().catch((error) => {
        console.log("Error\n", error);

        setMessageLogin(error.message);

        clientXmpp.stop();
      });
      // clientXmpp.start().catch((err) => {
      //   console.error("start failed", err);
      //   console.log(userName);
      // });

      clientXmpp.on("status", (status) => {
        //console.debug(status);
        if (status === "online") {
          clientXmpp.stop();
          //direct to chat page
          localStorage.setItem("username", userName);
          localStorage.setItem("password", password);
          history.push("/chat");
        }
      });

      //clientXmpp.stop();
    } else {
      console.log("Já está online");
    }
  };

  return (
    <div className="row bg-success mt-5 p-5 rounded">
      <div className="col-md-12">
        <div className="Login">
          <h1 className="text-dark pt-3">Chat App</h1>
          <p className="text-dark">USer Login</p>
          <div>
            <label
              for="exampleFormControlInput1"
              className="form-label text-dark"
            >
              Email address
            </label>

            <input
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              type="text"
              class="form-control"
              id="exampleFormControlInput1"
              placeholder="name@example.com"
            ></input>
          </div>
          <div>
            <label for="password" className="form-label text-dark">
              PAssword
            </label>

            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="text"
              class="form-control"
              id="password"
              placeholder="paswword"
            ></input>
          </div>
          <div>
            <button className="btn btn-dark mt-3" onClick={() => connect()}>
              Login
            </button>
          </div>

          <span>{messageLogin}</span>
          <div className="LinkArea">
            <Link to="/admin">Admin Area</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
