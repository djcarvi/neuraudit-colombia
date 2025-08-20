
import { Fragment } from "react"
import SpkDropdown from "../general-reusable/reusable-uielements/spk-dropdown";
import { Card, Dropdown, Image } from "react-bootstrap";
import SpkButton from "../general-reusable/reusable-uielements/spk-buttons";

interface Types {
    name?: string;
    mail?: string;
    imgSrc:string
}

interface SpkFriendscardProps {
    obj: Types;
    cardClass?: string;
}

const SpkFriendscard: React.FC<SpkFriendscardProps> = ({ obj, cardClass }) => {

    return (
        <Fragment>
            <Card className={`custom-card ${cardClass}`}>
                <Card.Body className="p-4 text-center">
                    <SpkDropdown Id="dropdownMenuButton1" Customclass="profile-friends-actions" Togglevariant="light" Menulabel="dropdownMenuButton1" Icon={true} IconClass="fe fe-more-vertical" Customtoggleclass="btn btn-icon rounded-circle border no-caret">
                        <Dropdown.Item as="li" href="#!"><i className="ri-edit-line me-2"></i> Edit</Dropdown.Item>
                        <Dropdown.Item as="li" href="#!"><i className="ri-delete-bin-line me-2"></i> Delete</Dropdown.Item>
                    </SpkDropdown>
                    <div className="lh-1 mb-2">
                        <span className="avatar avatar-xxl avatar-rounded">
                            <Image  src={obj.imgSrc} alt="" />
                        </span>
                    </div>
                    <div className="mb-3">
                        <span className="d-block fw-semibold">{obj.name}</span>
                        <span className="text-muted fs-13">{obj.mail}</span>
                    </div>
                    <div className="btn-list">
                        <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-facebook btn-wave rounded-circle waves-effect waves-light">
                            <i className="ri-facebook-line"></i>
                        </SpkButton>
                        <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-twitter btn-wave rounded-circle waves-effect waves-light">
                            <i className="ri-twitter-x-line"></i>
                        </SpkButton>
                        <SpkButton Buttonvariant="" Customclass="btn btn-icon btn-instagram btn-wave rounded-circle waves-effect waves-light">
                            <i className="ri-instagram-line"></i>
                        </SpkButton>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    )
}
export default SpkFriendscard;