import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Modal } from "react-bootstrap";
import { Icon } from '@iconify/react';
import axios from "./api/axios";
import { useEffect, useState } from "react";

const GET_URL = "v2/kumpulandoa";

function App() {
  const [data, setData] = useState([]);
  const reload = () => window.location.reload();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [show1, setShow1] = useState(false);
  const handleShow1 = () => setShow1(true);
  const handleClose1 = () => setShow1(false);
  const [nama, setNama] = useState("");
  const [namaNew, setNamaNew] = useState('');
  const [ayat, setAyat] = useState("");
  const [ayatNew, setAyatNew] = useState('');
  const [latin, setLatin] = useState("");
  const [latinNew, setLatinNew] = useState('');
  const [terjemah, setTerjemah] = useState("");
  const [terjemahNew, setTerjemahNew] = useState('');
  const [ide, setIde] = useState(JSON.parse(localStorage.getItem("idAyat")));


  useEffect(() => {
    fetchData();
  });

  const fetchData = async() => {
    axios({
      method:"get",
      url: GET_URL,
    }).then((response) => {
      setData(response?.data);
    })
  };

  const handleTambah = async(e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'v2/kumpulandoa',
      headers:{
        "Content-Type" : "application/json",
      },
      data: {
        doa: namaNew,
        ayat: ayatNew,
        latin: latinNew,
        artinya: terjemahNew,
      }
    }).then((response) => {
      if(response?.status == 201) {
        reload();
      }
    })
  }

  const handleEdit = async(e) => {
    e.preventDefault();
    axios({
      method:"put",
      url: `v2/kumpulandoa/${ide}`,
      data: {
        id: ide+"",
        doa: nama,
        ayat: ayat,
        latin: latin,
        artinya: terjemah,
      }
    }).then((response) => {
      console.log(response);
      handleClose();
      reload();
    })
  }

  function loopData(doa, ayat, latin, artinya, id) {
    async function handleDelete() {
      axios({
        method: 'delete',
        url: `v2/kumpulandoa/${id}`,
        headers: {
          'Accept': 'application/json',
        },
        data: id+"",
      }).then((response) => {
        if(response?.status == 200) {
          reload();
        }
      })
    };
    async function handleEdit() {
      const getId = async() => {
        axios({
          method: 'get',
          url: `v2/kumpulandoa/${id}`,
          headers: {
            'Accept': 'application/json',
          },
          data: id+"",
        }).then((response) => {
          handleShow();
          console.log(response);
          setNama(response?.data?.doa);
          setAyat(response?.data?.ayat);
          setLatin(response?.data?.latin);
          setTerjemah(response?.data?.artinya);
        })
      };
      getId()
    };
    return (
      <div className="px-5">
        <p className="text-center fs-4"><b>{doa}</b></p>
        <p className="text-end fs-4">{ayat}</p>
        <p>{latin}</p>
        <p style={{ marginTop: "-10px" }}>{artinya}</p>
        <div className="d-flex" style={{ marginLeft:"-10px" }}>
            <Button id={id} className="bg-white border-0" type="button" onClick={handleDelete}>
              <Icon icon="fluent:delete-12-filled" width={"25px" } color="red" />
            </Button>
            <Button id={id} className="bg-white border-0" onClick={(e) => {
                  localStorage.setItem("idAyat", id);
                  handleEdit();
                }}>
              <Icon icon="mi:edit-alt" width={"25px" } color="#24AADF" />
            </Button>
        </div>
        <hr></hr>
      </div>
    );
  } 
  return (
    <>
      <div className="row mt-2">
        <p className="fs-2 text-center">
          <b>Kumpulan Doa - Doa</b>
        </p>
        <div className="row">
          <div className="col d-flex justify-content-end">
            <Button className="btn" onClick={handleShow1}>
              <p className="m-0 p-0">TAMBAH DOA</p>
            </Button>
          </div>
        </div>
        {data.map(function(value) {
          return loopData(value.doa, value.ayat, value.latin, value.artinya, value.id)
        })}
      </div>

      {/* modal tambah */}
      <Modal
        show={show1}
        onHide={handleClose1}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="rounded-5"
        backdrop="static"
      >
        <Modal.Header closeButton className="m-2 mx-5 border-bottom border-3">
          <Modal.Title style={{ fontSize: "18px" }}>
            <div style={{ marginLeft: "-15px" }}>Tambah Doa</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mt-3 mx-4">
          <Form className="" onSubmit={handleTambah}>
            <Form.Group className="mb-3 fs-8">
              <Form.Label className="fw">Nama Doa</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Nama Doa"
                value={namaNew}
                onChange={(e) => setNamaNew(e.target.value)}
                className="rounded-3 fs-8"
                style={{ height: "48px" }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3 mt-1 fs-8"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fw">Ayat</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={ayatNew}
                onChange={(e) => setAyatNew(e.target.value)}
                className="rounded-3 fs-8 text-end"
                placeholder="Masukkan ayat"
              />
            </Form.Group>
            <Form.Group
              className="mb-3 mt-1 fs-8"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fw">Latin</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={latinNew}
                onChange={(e) => setLatinNew(e.target.value)}
                className="rounded-3 fs-8"
                placeholder="Masukkan Latin"
              />
            </Form.Group>
            <Form.Group
              className="mb-3 mt-1 fs-8"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fw">Terjemah</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={terjemahNew}
                onChange={(e) => setTerjemahNew(e.target.value)}
                className="rounded-3 fs-8"
                placeholder="Masukkan Terjemah"
              />
            </Form.Group>

            <div className="row mb-5" style={{ marginTop: "70px" }}>
              <div className="col  d-flex justify-content-end">
                <Button
                  className="text-center ms-3 p-2 btn-darkLight fs-8 border-0 pt-6 shadow-sm rounded-5 w-26"
                  style={{ height: "40px" }}
                  type="button"
                  onClick={handleClose1}
                >
                  <span className="fs-8 ms-1 d-none d-sm-inline font-black">
                    <b>BATALKAN</b>
                  </span>
                </Button>{" "}
                <Button
                  className="text-center ms-3 p-2 btn-green fs-8 border-0 pt-6 shadow-sm rounded-5 w-26"
                  style={{ height: "40px" }}
                  type="submit"
                >
                  <Icon icon="mingcute:save-fill" width="16px" height="16px" />
                  <span className="fs-8 ms-1 d-none d-sm-inline">
                    <b>EDIT DATA</b>
                  </span>
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/* modal edit */}
      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="rounded-5"
        backdrop="static"
      >
        <Modal.Header closeButton className="m-2 mx-5 border-bottom border-3">
          <Modal.Title style={{ fontSize: "18px" }}>
            <div style={{ marginLeft: "-15px" }}>Edit Doa</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="mt-3 mx-4">
          <Form className="" onSubmit={handleEdit}>
            <Form.Group className="mb-3 fs-8">
              <Form.Label className="fw">Nama Doa</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Nama Doa"
                defaultValue={nama}
                onChange={(e) => setNama(e.target.value)}
                className="rounded-3 fs-8"
                style={{ height: "48px" }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3 mt-1 fs-8"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fw">Ayat</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                defaultValue={ayat}
                onChange={(e) => setAyat(e.target.value)}
                className="rounded-3 fs-8 text-end"
                placeholder="Masukkan ayat"
              />
            </Form.Group>
            <Form.Group
              className="mb-3 mt-1 fs-8"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fw">Latin</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                onChange={(e) => setLatin(e.target.value)}
                defaultValue={latin}
                className="rounded-3 fs-8"
                placeholder="Masukkan Latin"
              />
            </Form.Group>
            <Form.Group
              className="mb-3 mt-1 fs-8"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fw">Terjemah</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                onChange={(e) => setTerjemah(e.target.value)}
                defaultValue={terjemah}
                className="rounded-3 fs-8"
                placeholder="Masukkan Terjemah"
              />
            </Form.Group>

            <div className="row mb-5" style={{ marginTop: "70px" }}>
              <div className="col  d-flex justify-content-end">
                <Button
                  className="text-center ms-3 p-2 btn-darkLight fs-8 border-0 pt-6 shadow-sm rounded-5 w-26"
                  style={{ height: "40px" }}
                  type="button"
                  onClick={handleClose}
                >
                  <span className="fs-8 ms-1 d-none d-sm-inline font-black">
                    <b>BATALKAN</b>
                  </span>
                </Button>{" "}
                <Button
                  className="text-center ms-3 p-2 btn-green fs-8 border-0 pt-6 shadow-sm rounded-5 w-26"
                  style={{ height: "40px" }}
                  type="submit"
                >
                  <Icon icon="mingcute:save-fill" width="16px" height="16px" />
                  <span className="fs-8 ms-1 d-none d-sm-inline">
                    <b>EDIT DATA</b>
                  </span>
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
    </>
  );
}

export default App;
