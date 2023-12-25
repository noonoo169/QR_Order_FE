import React from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";

const TableOrderedError = () => {


  return (
    <Helmet title="Error">
      <CommonSection title="Error" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              This table has been ordered

            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default TableOrderedError;
