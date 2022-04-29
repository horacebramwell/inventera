import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { BsPlusLg } from 'react-icons/bs';
import { toast } from 'react-toastify';
import PrimaryButton from '../../components/buttons/primary';
import PageHeader from '../../components/header';
import SiteModal from '../../components/modal';
import MaterialForm from '../../components/forms/materials';
import MaterialTable from '../../components/tables/material';
import {
  deleteMaterial,
  updateMaterial,
  createMaterial,
  setMaterial,
  reset,
} from '../../redux/features/material/materialSlice';
import { materialData } from '../../formDefaults';

export default function Materials() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState(materialData);
  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { materials, material, error, success, loading, message } = useSelector(
    (state) => state.material,
  );
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);

  const { token } = user;

  /* HANDLE SELECT */
  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  };

  /* HANDLE CHANGE */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* HANDLE EDIT */
  const handleEdit = () => {
    handleShow();
    setFormData({
      ...material,
      category: material.categoryId,
      supplier: material.supplierId,
      lastOrdered: material.lastOrdered.substring(0, 10),
    });
  };

  /* HANDLE UPDATE */
  const handleUpdate = (date) => {
    const id = selected[0];

    const data = {
      token,
      materialId: id,
      material: {
        ...formData,
        lastOrdered: date.toISOString(),
      },
    };

    dispatch(updateMaterial(data));
  };

  /* HANDLE DELETE */
  const handleDelete = () => {
    const materialsToDelete = [...selected];

    if (materialsToDelete.length > 0) {
      materialsToDelete.forEach((id) => {
        const data = {
          materialId: id,
          token,
        };

        dispatch(deleteMaterial(data));
      });

      setSelected([]);
    }
  };

  /* HANDLE CREATE */
  const handleCreate = (date) => {
    const data = {
      material: {
        ...formData,
        lastOrdered: date.toISOString(),
      },
      token,
    };

    dispatch(createMaterial(data));
  };

  /* HANDLE SUBMIT */
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    } else {
      const selectedMaterials = [...selected];

      let lastOrdered;

      if (formData.lastOrdered) {
        lastOrdered = new Date(formData.lastOrdered);
      }

      if (selectedMaterials.length === 1) {
        handleUpdate(lastOrdered);
      } else {
        handleCreate(lastOrdered);
      }
    }
  };

  /* DISPLAYS ERROR & SUCCESS MESSAGES */
  useEffect(() => {
    if (error && message) {
      toast.error(message);
      dispatch(reset());
    }

    if (success && message) {
      toast.success(message);
      dispatch(reset());
      handleClose();
    }

    if (!show) {
      setFormData(materialData);
    }
  }, [error, success, message, show, dispatch]);

  /* SETS MATERIAL IF ONLY ONE IS SELECTED */
  useEffect(() => {
    if (selected.length === 1) {
      const id = selected[0];

      const mat = materials.find((item) => item.id === id);

      dispatch(setMaterial(mat));
    }
  }, [selected, materials, dispatch]);

  return (
    <>
      <PageHeader>
        <Container>
          <Row>
            <Col sm={6}>
              <h2>Materials</h2>
            </Col>
            <Col sm={6} className="d-flex justify-content-end">
              <PrimaryButton onClick={handleShow}>
                <BsPlusLg />
                Add Material
              </PrimaryButton>
            </Col>
          </Row>
        </Container>
      </PageHeader>

      <Container className="mt-3">
        {selected.length > 0 && (
          <ButtonGroup className="mt-3">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            {selected.length === 1 && (
              <Button variant="outline-dark" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </ButtonGroup>
        )}
        <MaterialTable handleSelect={handleSelect} />

        <SiteModal
          show={show}
          handleClose={handleClose}
          modalTitle={selected.length === 1 ? 'Edit Material' : 'Add Material'}
        >
          <MaterialForm
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={formData}
            validated={validated}
          />
        </SiteModal>
      </Container>
    </>
  );
}
