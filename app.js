const express = require('express');

const app = express();

const db = require('./models'); // directory 안에서 /index 적지 않아도 자동으로 index.js 파일 찾음

const { Member } = db;

app.use(express.json()); // express.json() : middleware

app.get('/', (req, res) => {
  res.send('URL should contain /api/..');
});

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({
      where: { team },
      // order: [['admissionDate', 'DESC']],
    });
    res.send(teamMembers);
  } else {
    const members = await Member.findAll({
      // order: [['admissionDate', 'DESC']],
    });
    res.send(members);
  }
  //   res.send(members);
});

app.post('/api/members', async (req, res) => {
  //   console.log(req.body);
  const newMember = req.body;
  // const member = Member.build(newMember);
  // member.name = 'Mike';
  // await member.save();
  const member = await Member.create(newMember);
  res.send(member);
});

// app.put('/api/members/:id', async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
//   // const member = members.find((m) => m.id === Number(id));
//   // if (member) {
//   //   Object.keys(newInfo).forEach((prop) => {
//   //     member[prop] = newInfo[prop];
//   //   });
//   //   res.send(member);
//   // } else {
//   //   res.status(404).send({ message: 'There is no member with the id!' });
//   // }
//   const result = await Member.update(newInfo, { where: { id } });
//   if (result[0]) {
//     res.send({ message: `${result[0]} row(s) affected` });
//   } else {
//     res.status(404).send({ message: 'There is no member with the id!' });
//   }
// });

app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  // const membersCount = members.length;
  // members = members.filter((member) => member.id !== Number(id));
  // if (members.length < membersCount) {
  //   res.send({ message: 'Deleted' });
  // }

  // way1
  // const deleteCount = await Member.destroy({ where: { id } });
  // if (deleteCount) {
  //   res.send({ message: `${deleteCount} row(s) deleted` });
  // }

  // way2
  const member = await Member.findOne({ where: { id } });
  if (member) {
    const result = await member.destroy();
    res.send({ messaage: `1 row deleted` });
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

app.get('/api/members/:id', async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params; // object destructuring 문법
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with the id!' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening...');
});
