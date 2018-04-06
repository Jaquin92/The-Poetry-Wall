import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert2'
import logo from './pencil.png';
import paper from './paper.png'
import './App.css';

class App extends Component {
  constructor() {
    super()

    this.state = {
      poem: "",
      title: "",
      author: "",
      poems: []
    }
  }

  componentDidMount() {
    axios.get("/api/poems").then(r => {
      this.setState({ poems: r.data })
    }).catch(err => console.log(err))
  }

  addAnonymous(body, title) {

    if (body.length < 10) {
      swal("Please write a longer Poem :)")
      return
    } else if (title.length < 1) {
      swal("Thats not a cool title")
      return
    }
    if (body.length > 250) {
      swal("Poem is way too long bro.")
      return
    } else if (title.length > 25) {
      swal("Title is way too long.")
      return
    }

    let poem = { body: body, title: title }
    axios.post("/api/noName", poem).then(r => {

      this.setState({ poems: r.data, title: "", poem: "", author: "" })
    }).catch(err => console.log(err))
  }

  add(body, title, author) {
    if (body.length < 10) {
      swal("Please write a longer Poem :)")
      return
    } else if (title.length < 1) {
      swal("Thats not your name")
      return
    }
    if (body.length > 250) {
      swal("Poem is way too long bro.")
      return
    } else if (title.length > 25) {
      swal("Title is way too long.")
    }




    let poem = {
      body, title, author
    }

    axios.post("/api/add", poem).then(r => {
      this.setState({ poems: r.data, title: "", poem: "", author: "" })
    }).catch(err => console.log(err))
  }






  changetitle() {
    swal.setDefaults({
      input: 'text',
      confirmButtonText: 'Next',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    })

    var steps = [
      {
        title: 'Author',
        text: 'Leave blank for Anonymous'
      },
      {
        title: 'Title',
        inputPlaceholder: "Max 25 Characters"
      },
      {
        title: 'Poem',
        inputPlaceholder: "Max 250 Characters"
      }
    ]

    swal.queue(steps).then((result) => {
      swal.resetDefaults()



      if (result.value) {
        this.setState({ author: result.value[0], title: result.value[1], poem: result.value[2] })
        swal({
          title: 'Poem Posted',
          html:
            'Sweet!',
          confirmButtonText: 'Read More'
        })


        if (this.state.author === "") {
          this.addAnonymous(this.state.poem, this.state.title)
        } else {
          this.add(this.state.poem, this.state.title, this.state.author)
        }


      }
    })
  }

  render() {


    let poems = this.state.poems.map((item, i) => {
      return <div className="card" key={i} >
        <h1>{item.title.toUpperCase()}</h1>
        <p style={{ padding: "0px 20%" }}>  <b>"</b>{item.body}<b>"</b> </p>
        <p>- <b>{item.author}</b></p>

      </div>
    })
    console.log(this.state)
    return (



      <div  >


        <div className="header"  >

          <img class="paper" src={paper} alt="" onClick={() => this.changetitle()} />

          <div className="wall" ><h1>The Poetry Wall</h1></div>
        </div>

        <div className="container">

          <div className="poemContainer">{poems}</div></div>


      </div>

    );
  }
}

export default App;
