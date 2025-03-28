import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children, onClick})
{
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

export default function App()
{

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend()
  {
    setShowAddFriend(() => !showAddFriend);
    setSelectedFriend(null);

  }

  function onAddFriend(newFriend)
  {
    setFriendList(() => [...friendList, newFriend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend)
  {
    setSelectedFriend((selectedFriend) => selectedFriend === null ? friend : selectedFriend.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }
  


  function handleSplitFormSubmit(e)
  {
    e.preventDefault();

    if(!billValue || !yourExpense) {
      setBillValue("");
      setYourExpense("");
      setBiller("user");
      setSelectedFriend(null);
      return;
    }
    setFriendList(() => {
      return friendList.map((friend) => {
        return friend.id === selectedFriend.id 
        ? biller !== "user" 
        ? {...friend, balance : friend.balance - yourExpense} : {...friend, balance : friend.balance + billValue - yourExpense}
        : friend
      });
    });

    setBillValue("");
    setYourExpense("");
    setBiller("user");
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList  friends = {friendList} onSelectedFriend = {handleSelectedFriend} selectedFriend = {selectedFriend} />
        {showAddFriend && <FormAddFriend  onAddFriend = {onAddFriend} />}
        <Button onClick = {handleShowAddFriend}>{showAddFriend ? "Close" : "Add Friend"}</Button>
      </div>
      {selectedFriend && 
      <FormSplitBill
        selectedFriend = {selectedFriend} 
        handleSubmit = {handleSplitFormSubmit}
        key = {selectedFriend.id}
      />}
    </div>
  );
}

function FriendsList({friends, onSelectedFriend, selectedFriend})
{
  return (
    <ul>
      {
        friends.map((friend) => {
          return <Friend friend = {friend}  key = {friend.id} onSelectedFriend = {onSelectedFriend} selectedFriend = {selectedFriend} />
        })
      }
    </ul>
  )
}

function Friend({friend, onSelectedFriend, selectedFriend})
{
  const isSelected = selectedFriend !== null ? selectedFriend.id === friend.id ? true : false : false;

  return <li className={isSelected ? "selected" : ""}>

    <img src = {friend.image} alt = {friend.name} />
    <h3>{friend.name}</h3>
    {
      friend.balance < 0 &&
      <p className="red"> You owe {friend.name} {Math.abs(friend.balance)} Rupees</p>
    }
    {
      friend.balance > 0 &&
      <p className="green">{friend.name} owe you {friend.balance} Rupees</p>
    }
    {
      friend.balance === 0 &&
      <p> You and {friend.name} are even</p>
    }
    <Button onClick = {() => onSelectedFriend(friend)}>
      {isSelected ? "Close" : "Select"}
    </Button>
  </li>
}

function FormAddFriend({onAddFriend})
{

  const [friendName,setFriendName] = useState('');
  const [imageUrl, setImageUrl] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e)
  {
    e.preventDefault();
    if(!friendName || !imageUrl) {
      alert("Please enter the Name and Image of the new Friend");
      return;
    }
    const id = crypto.randomUUID();
    const newFriend = {id : id, name: friendName, image: imageUrl + id, balance : 0};

    onAddFriend(newFriend);

    setFriendName('');
    setImageUrl('https://i.pravatar.cc/48');

  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit} >
      <label>🧑‍🤝‍🧑Name</label>
      <input type = "text"  value = {friendName}  onChange={e => setFriendName(e.target.value)} />
      <label>📎Image URL</label>
      <input type = "text"  value = {imageUrl} onChange={e => setImageUrl(e.target.value)} />
      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({selectedFriend, handleSubmit})
{

  const [billValue, setBillValue] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [biller, setBiller] = useState('user');
  const friendExpense = billValue ? billValue - yourExpense : "";

  function onBillValueChange(e)
  {
    setBillValue(() => Number(e.target.value));
  }

  function onYourExpenseChange(e)
  {
    setYourExpense(() => {
      return Number(e.target.value) > billValue ? yourExpense : Number(e.target.value);
    });
  }

  function onBillerChange(e)
  {
    setBiller(() => e.target.value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit} >
      <h2>Split a bill with {selectedFriend.name} </h2>
      <label>💰 BIll Value</label>
      <input type = "text" value = {billValue} onChange = {onBillValueChange}/>

      <label>🤵🏻 Your Expense</label>
      <input type = "text" value = {yourExpense} onChange = {onYourExpenseChange} />

      <label>👲🏻{selectedFriend.name}'s Expense</label>
      <input type = "text"  disabled value = {friendExpense} />

      <label>Who is going to pay the Bill ?</label>
      <select value = {biller} onChange = {onBillerChange} >
        <option value = "user">You</option>
        <option value = "friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  )
}
