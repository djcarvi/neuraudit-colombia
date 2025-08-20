
import { Fragment, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import ListBox from "react-listbox";
import PhoneInput from 'react-phone-number-input'
import { CountrySelect, } from "react-country-state-city";
import Tags from "@yaireo/tagify/dist/react.tagify";
import SpkSelect from "../../../../shared/@spk-reusable-components/reusable-plugins/spk-reactselect";
import { Tagifyselectdata } from "../../../../shared/data/pages/forms/formadvancedata";
import Seo from "../../../../shared/layouts-components/seo/seo";
import Pageheader from "../../../../shared/layouts-components/pageheader/pageheader";
import AutocompleteTextField from "react-autocomplete-input";

interface TagifySettings {
    maxTags: number;
    placeholder: string;
    dropdown: {
        enabled: number;
    };
}

const FormAdvanced = () => {

    const [value, setValue] = useState<any>()
    const [value1, setValue1] = useState<any>()
    const [_countryid, setCountryid] = useState(0);

    interface SelectType {
        value: string;
        label: string;
    }
    const [selected, setSelected] = useState<any>([1, 2]);
    const options: SelectType[] = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' },
        { value: 'three', label: 'Three' },
        { value: 'four', label: 'Four' },
        { value: 'five', label: 'Five' },
        { value: 'six', label: 'Six' },
        { value: 'seven', label: 'Seven' },
        { value: 'eight', label: 'Eight' },
        { value: 'nine', label: 'Nine' },
        { value: 'ten', label: 'Ten' },
    ];

    const options1: SelectType[] = [
        { label: 'One', value: " 1" },
        { label: 'Two', value: " 2" },
        { label: 'Three', value: "3" },
    ];
    const [select, setSelect] = useState<any>([1, 2]);


    //*** Tagify ***//

    const [tags, setTags] = useState<string>("tag2, tag2");

    // Function to handle tag changes
    const handleChange = (e: CustomEvent<{ value: string }>) => {
        setTags(e.detail.value);
        console.log("Tags:", e.detail.value);
    };

    // Tagify settings
    const tagifySettings: TagifySettings = {
        maxTags: 10,
        placeholder: "Add tags here...",
        dropdown: {
            enabled: 0,
        },
    };

    const [tags1, setTags1] = useState<string>("CSS, HTML, JavaScript");

    // Function to handle tag changes
    const handleChange1 = (e: CustomEvent<{ value: string }>) => {
        setTags1(e.detail.value);
        console.log("Tags:", e.detail.value);
    };

    // Tagify settings
    const tagifySettings1: TagifySettings = {
        maxTags: 10,
        placeholder: "Add more tags...",
        dropdown: {
            enabled: 0,
        },
    };

    const [tags2, setTags2] = useState<string>("tag1, tag2, tag3, tag4, tag5, tag6");

    // Function to handle tag changes
    const handleChange2 = (e: CustomEvent<{ value: string }>) => {
        setTags2(e.detail.value);
        console.log("Tags:", e.detail.value);
    };

    // Tagify settings
    const tagifySettings2: TagifySettings = {
        maxTags: 10,
        placeholder: "Add more tags...",
        dropdown: {
            enabled: 0,
        },
    };

    
	//
	const top100Films:any = [
		'Soda',
		'Burger, Milkshake',
		'Tacos, Margarita',
		'Pasta, Red Wine',
		'Sushi, Green Tea',
		"Steak, Whiskey",
		'Salad, Sparkling Water',
		'Chicken Wings, Beer',
		'Fish and Chips, Lemonade',
		'Burrito, Iced Tea'
	]
	const Colors:any = [
		'Lavender',
		'Turquoise',
		'Coral',
		'Sapphire',
		'Emerald',
		'Rose Gold',
		'Azure',
		'Goldenrod',
		'Amethyst',
		'Crimson',
		'Periwinkle',
		'Mint Green',
		'Tangerine',
		'Charcoal',
		'Champagne',
		'Aqua',
		'Ruby',
		'Topaz',
		'Cerulean',
		'Pearl',
	]

    return (

        <Fragment>

            {/* <!-- Page Header --> */}

            <Seo title="Forms-Form Advanced" />

            <Pageheader title="Forms" currentpage="Form Advanced" activepage="Form Advanced" />

            {/* <!-- Page Header Close --> */}

            {/* <!-- Start::row-1 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">AUTO COMPLETE</div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col xl={4}>
                                    <Form.Label htmlFor="autoComplete" className="form-label">Search Results Of Food & Drinks Combo</Form.Label>
                                    <AutocompleteTextField trigger={["", "@@"]} options={top100Films} id="autoComplete" className="form-control header-autoComplete" />
                                </Col>
                                <Col xl={4}>
                                    <Form.Label htmlFor="autoComplete-color" className="form-label">Advanced Search Results For Colors</Form.Label>
                                    <AutocompleteTextField trigger={["", "@@"]} options={Colors} id="autoComplete-color" className="form-control header-autoComplete" />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!--End::row-1 --> */}

            {/* <!-- Start:: row-2 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                TELEPHONE INPUT
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-4">
                                <Col xl={3}>
                                    <Form.Label htmlFor="phone" className="form-label d-block">Basic Telephone Input</Form.Label>
                                    <PhoneInput placeholder="Enter phone number" value={value} onChange={setValue} />
                                </Col>
                                <Col xl={4}>
                                    <Form.Label htmlFor="phone-only-countries" className="form-label d-block">Telephone Input With  Default Country</Form.Label>
                                    <PhoneInput placeholder="Enter phone number" defaultCountry="US" value={value1} onChange={setValue1} />
                                </Col>

                                <Col xl={4}>
                                    <Form.Label htmlFor="phone-existing-number" className="form-label d-block">Input With Only Countries</Form.Label>
                                    <CountrySelect onChange={(e: any) => { setCountryid(e.id); }} placeHolder="Select Country" className="border-0" />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-2 --> */}

            {/* <!-- Start:: row-3 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                TAGIFY JS
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-3">
                                <Col xl={6}>
                                    <Form.Label className="form-label d-block">Basic Tagify</Form.Label>
                                    <Tags value={tags} settings={tagifySettings} onChange={handleChange} />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="form-label d-block">Tagify With Custom Suggestions</Form.Label>
                                    <Tags value={tags1} settings={tagifySettings1} onChange={(e: CustomEvent) => handleChange1(e as CustomEvent<{ value: string }>)} />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="form-label d-block">Disabled User Input</Form.Label>
                                    <Form.Control name='tags-disabled-user-input' placeholder='Select tags from the list' className="form-control" disabled />
                                </Col>
                                <Col xl={6}>
                                    <Form.Label className="form-label d-block">Drag & Sort</Form.Label>
                                    <Tags value={tags2} settings={tagifySettings2} onChange={(e: CustomEvent) => handleChange2(e as CustomEvent<{ value: string }>)} />
                                </Col>
                                <Col xl={12}>
                                    <Form.Label className="form-label d-block">Tagify Single-Value Select</Form.Label>
                                    <SpkSelect name="colors" option={Tagifyselectdata} mainClass="default basic-multi-select" id="choices-multiple-default" menuplacement='auto' classNameprefix="Select2" />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-3 --> */}

            {/* <!-- Start:: row-4 --> */}

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">DUAL LIST BOX</div>
                        </Card.Header>
                        <Card.Body>
                            <Row className="gy-4">
                                <Col xxl={6}>
                                    <h6>Select by class :</h6>
                                    <ListBox options={options} onChange={(newValue: any) => setSelected(newValue)} selected={selected} />
                                </Col>
                                <Col xxl={6}>
                                    <h6>Add options and add eventListeners :</h6>
                                    <ListBox options={options1} onChange={(newValue: any) => setSelect(newValue)} selected={select} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <!-- End:: row-4 --> */}

        </Fragment>
    )
};

export default FormAdvanced;