function makeFriendsList(friends) {
  const friendsList = document.createElement('ul');

  friends.forEach(({firstName, lastName}) => {
    const item = document.createElement('li');

    item.textContent = `${firstName} ${lastName}`;

    friendsList.append(item);
  });

  return friendsList;
}
