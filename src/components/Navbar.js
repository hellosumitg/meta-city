import logo from "../assets/logo.png";

const Navbar = ({ web3Handler, account }) => {
  return (
    <nav className="flex-between">
      <a
        className="flex"
        href="https://github.com/hellosumitg"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={logo} className="App-logo" alt="logo" />
        Metacity
      </a>

      {account ? (
        <a
          href={`${""}/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
          className="button"
        >
          {/* below we are going to show the first 5digits and the last 5digits of account */}
          {account.slice(0, 5) + "..." + account.slice(38, 42)}
        </a>
      ) : (
        <button onClick={web3Handler} className="button">
          Connect Wallet
        </button>
      )}
      {/* this `web3Handler()`(created in the App.js file) is being passed when we render this Navbar component in the App.js */}
    </nav>
  );
};

export default Navbar;
