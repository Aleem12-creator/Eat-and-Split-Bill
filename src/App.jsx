import { Children, useState } from "react";

let initialFriends = [
  {
    id: 11,
    name: "Admin",
    image: "/Ali.jpg",
    balance: 70,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

const App = () => {
  const [display, setdisplay] = useState(true);
  const [friends, setfriends] = useState(initialFriends);
  const [selectedfriend, setselectedfriend] = useState("");

  function handleAddFriend(newfriend) {
    setfriends((friends) => [...friends, newfriend]);
    setdisplay(false);
  }
  function handledisplay(e) {
    e.preventDefault();
    setdisplay((show) => !show);
  }
  function handleselected(friend) {
    setselectedfriend((cur) => (cur?.id === friend.id ? null : friend));
    setdisplay(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friends={friends}
          onSelection={handleselected}
          selected={selectedfriend}
        />
        {display && <FormAddFriend onAddfriend={handleAddFriend} />}
        <Button onClick={handledisplay}>
          {display ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedfriend && <FormSplitBill selectedfriend={selectedfriend} />}
    </div>
  );
};

export default App;

function Friends({ friends, onSelection, selected }) {
  return (
    <ul className="Friendlist">
      {friends.map((friends) => (
        <Friend
          friend={friends}
          key={friends.id}
          selected={selected}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selected }) {
  const isselected = selected?.id === friend.id;
  return (
    <li className={isselected ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          ows you {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p> you and {friend.name}</p>}
      <Button onClick={() => onSelection(friend)}>
        {isselected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddfriend }) {
  const [name, setname] = useState("");
  const [img, setimg] = useState({
    file: null,
    url: "",
  });
  const handleuserimg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setimg({ file, url });
    }
  };
  const id = crypto.randomUUID().slice(0, 4);
  const balance = Math.floor(Math.random() * (20 - -10 + 1)) + -10;

  function handleformsubmit(e) {
    e.preventDefault();
    if (!name || !img) return;
    const newfriend = {
      id,
      name,
      image: img.url,
      balance,
    };
    onAddfriend(newfriend);
    initialFriends = [...initialFriends, newfriend];
    // console.log(newfriend);

    setname("");
    setimg("");
  }

  return (
    <>
      <form className="form-add-friend" onSubmit={handleformsubmit}>
        <label>👫Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <label htmlFor="file-upload" className="custom-file-label">
          <img
            className="user-img"
            src={img.url || "./img-icon.png"}
            width={"45px"}
            height={"45px"}
          />
        </label>
        <input
          type="file"
          id="file"
          style={{ width: "150px" }}
          onChange={handleuserimg}
        />
        {/* <input
          type="text"
          value={img}
          onChange={(e) => setimg(e.target.value)}
        /> */}
        <Button>Add</Button>
      </form>
    </>
  );
}

function FormSplitBill({ selectedfriend }) {
  const [bill, setbill] = useState("");
  const [payedbyuser, setpayedbyuser] = useState("");
  const [whopaynig, setwhopaying] = useState("");
  const payedbyfriend = bill ? bill - payedbyuser : "";
  function handlesubmit() {
    if (!bill || !payedbyuser) return;
  }
  return (
    <form className="form-split-bill" onSubmit={handlesubmit}>
      <h2>Split Bill With {selectedfriend.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />
      <label>⛹️‍♂️Your Expense</label>
      <input
        type="text"
        value={payedbyuser}
        onChange={(e) =>
          setpayedbyuser(
            Number(e.target.value) > bill ? payedbyuser : Number(e.target.value)
          )
        }
      />
      <label>👫{selectedfriend.name} Expense</label>
      <input type="text" disabled value={payedbyfriend} />
      <label>💲Who is paying the bill</label>
      <select value={whopaynig} onChange={(e) => setwhopaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
