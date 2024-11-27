class Member {
  constructor(
    id,
    name,
    address,
    city,
    email,
    phone,
    status = "active",
    username,
    password
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.city = city;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.username = username;
    this.password = password;
    this.blogEntries = [];
  }

  addBlogEntry(order) {
    this.blogEntries.push(order);
  }
}
export default Member;
