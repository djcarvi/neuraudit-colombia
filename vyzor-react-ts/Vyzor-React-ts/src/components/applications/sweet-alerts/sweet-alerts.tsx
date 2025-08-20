
import React, { Fragment } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Swal from 'sweetalert2';
import Seo from "../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../shared/layouts-components/pageheader/pageheader";
import SpkButton from "../../../shared/@spk-reusable-components/general-reusable/reusable-uielements/spk-buttons";
import media59 from '../../../assets/images/media/media-59.jpg';
import media19 from '../../../assets/images/media/media-19.jpg';
interface SweetAlertsProps { }

const SweetAlerts: React.FC<SweetAlertsProps> = () => {

    function Basicsweetalert() {
        Swal.fire({
            title: 'Hello this is Basic alert message',
            allowOutsideClick: true,
            confirmButtonColor: '#3085d6'
        });
    }

    // Titlealert
    function Titlealert() {
        Swal.fire(
            'The Internet ?',
            'That thing is still around ?',
            'question'
        );
    }

    //Footer
    function Footeralert() {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href="">Why do I have this issue?</a>'
        });
    }

    //Long window
    function Longwindow() {
        Swal.fire({
            imageUrl: 'https://placeholder.pics/svg/300x1500',
            imageHeight: 1500,
            imageAlt: 'A tall image'
        });
    }

    function datatattatata() {

        Swal.fire({
            title: "<strong>HTML <u>example</u></strong>",
            icon: "info",
            html:
                "You can use <b>bold text</b>, " +
                "<a href=\"//sweetalert2.github.io\" target=\"_blank\">links</a> " +
                "and other HTML tags",
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                "<i class=\"fe fe-thumbs-up\"></i> Great!",
            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText:
                "<i class=\"fe fe-thumbs-down\"></i>",
            cancelButtonAriaLabel: "Thumbs down",
        });
    }

    //multiple buttons
    function Multiplebuttons() {
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire('Saved!', '', 'success');
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info');
            }
        });
    }

    //position 
    function Positiondialog() {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
        });
    }

    //confirmalert
    function Confirmalert() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                );
            }
        });
    }

    //parameter
    function Parameteralert() {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success parameter-button ms-2',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                );
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                );
            }
        });
    }

    //image alert
    function Imagealert() {
        Swal.fire({
            title: 'Sweet!',
            text: 'Modal with a custom image.',
            imageUrl: media59,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
        });
    }

    //backgroundimage
    function Backgroundimage() {
        Swal.fire({
            title: 'Custom width, padding, color, background.',
            width: 600,
            padding: '3em',
            color: '#716add',
            background: `#fff url(${media19})`,

        });
    }

    function Autoclose() {
        let timerInterval: string | number | NodeJS.Timeout | undefined;

        Swal.fire({
            title: 'Auto close alert!',
            html: 'I will close in <b></b> milliseconds.',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const b = Swal.getHtmlContainer()?.querySelector('b'); // Use optional chaining here
                if (b) {
                    timerInterval = setInterval(() => {
                        const timerLeft = Swal.getTimerLeft()?.toString() || '0'; // Use optional chaining and provide a default value
                        b.textContent = timerLeft;
                    }, 100);
                }
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer');
            }
        });
    }
    //Ajax
    function Ajaxalert() {
        Swal.fire({
            title: 'Submit your Github username',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            preConfirm: (login: any) => {
                return fetch(`//api.github.com/users/${login}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        );
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `${result.value.login}'s avatar`,
                    imageUrl: result.value.avatar_url
                });
            }
        });
    }

    return (
        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Applications-Sweet Alerts" />

            <Pageheader title="Applications" currentpage="Sweet Alerts" activepage="Sweet Alerts" />

            {/* <!-- Page Header Close --> */}

            <Row>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Basic Alert
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="basic-alert" onClickfunc={Basicsweetalert}>Basic Alert</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Title With Text Under
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-text" onClickfunc={Titlealert}>Title With Text</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                With Text,Error Icon & Footer
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-footer" onClickfunc={Footeralert}>Alert Footer</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Alert With Long Window
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="long-window" onClickfunc={Longwindow}>Long Window Here</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Custom HTML Description
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-description" onClickfunc={datatattatata}>Custom HTML Alert</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Alert With Multiple Buttons
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="three-buttons" onClickfunc={Multiplebuttons}>Multiple Buttons</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Custom Positioned Dialog Alert
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-dialog" onClickfunc={Positiondialog}>Alert Dialog</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Confirm Alert
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-confirm" onClickfunc={Confirmalert}>Confirm Alert</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card parameter-alert">
                        <Card.Header>
                            <Card.Title>
                                Alert With Parameters
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-parameter" onClickfunc={Parameteralert}>Alert Parameters</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Alert With Image
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-image" onClickfunc={Imagealert}>Image Alert</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Alert With Image
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-custom-bg" onClickfunc={Backgroundimage}>Custom Alert</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Auto Close Alert
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-auto-close" onClickfunc={Autoclose}>Auto Close</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={4}>
                    <Card className=" custom-card">
                        <Card.Header>
                            <Card.Title>
                                Ajax Request Alert
                            </Card.Title>
                        </Card.Header>
                        <Card.Body className=" text-center">
                            <SpkButton Buttonvariant='primary' Id="alert-ajax" onClickfunc={Ajaxalert}>Ajax Request</SpkButton>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default SweetAlerts;
