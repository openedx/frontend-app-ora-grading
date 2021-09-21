import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Card,
  Button,
  Form,
} from '@edx/paragon';

/**
 * <GradingRubric />
 */
export const GradingRubric = ({
}) => {
    return (
        <Card className="grading-rubric-card">
            <Card.Body className="grading-rubric-body">
                <h3>Rubric</h3>
                <hr />
                <Form.Group>
                    <Form.Label>Which Color?</Form.Label>
                    <Form.RadioSet
                        name="colors"
                    >
                        <Form.Radio value="red">Red</Form.Radio>
                        <Form.Radio value="green">Green</Form.Radio>
                        <Form.Radio value="blue">Blue</Form.Radio>
                        <Form.Radio value="cyan" disabled>Cyan</Form.Radio>
                    </Form.RadioSet>
                </Form.Group>
                <Form.Group>
                    <Form.Control
                        floatingLabel="Comments"
                    />
                </Form.Group>
                <Form.Group isInvalid>
                    <Form.Label>Which Color?</Form.Label>
                    <Form.RadioSet
                        name="colors"
                    >
                        <Form.Radio value="red">Red</Form.Radio>
                        <Form.Radio value="green">Green</Form.Radio>
                        <Form.Radio value="blue">Blue</Form.Radio>
                        <Form.Radio value="cyan" disabled>Cyan</Form.Radio>
                    </Form.RadioSet>
                    <Form.Control.Feedback type="invalid">
                        Make a selection
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group isInvalid>
                    <Form.Control
                        floatingLabel="Comments"
                    />
                    <Form.Control.Feedback type="invalid">
                        Make a comment
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Which Color?</Form.Label>
                    <Form.RadioSet
                        name="colors"
                    >
                        <Form.Radio value="red">Red</Form.Radio>
                        <Form.Radio value="green">Green</Form.Radio>
                        <Form.Radio value="blue">Blue</Form.Radio>
                        <Form.Radio value="cyan" disabled>Cyan</Form.Radio>
                    </Form.RadioSet>
                </Form.Group>
                <Form.Group>
                    <Form.Control
                        floatingLabel="Comments"
                    />
                </Form.Group>

            </Card.Body>
            <div className="grading-rubric-footer">
                <Button>Submit Grade</Button>
            </div>
        </Card>
    );
}

GradingRubric.defaultProps = {};
GradingRubric.propTypes = {};

export const mapStateToProps = (state) => ({
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(GradingRubric);
