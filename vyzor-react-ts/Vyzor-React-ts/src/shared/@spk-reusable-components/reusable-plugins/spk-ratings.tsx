import React, { Fragment } from 'react';
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";

interface SpkRatingsProps {
    name: string;
    value?: number | null;
    size?: 'small' | 'medium' | 'large';
    max?: number;
    sx?: object;
    defaultValue?: number | null;
    readOnly?: boolean;
    precision?: number;
    onChange?: (event: React.ChangeEvent<{}>, newValue: number | null) => void;
    getLabelText?: (value: number) => string;
    onChangeActive?: (event: React.ChangeEvent<{}>, newHover: number) => void;
    Icon?: React.ReactNode;
}

const SpkRatings: React.FC<SpkRatingsProps> = ({ name, value, size = 'medium', defaultValue = null, max = 5, sx = {}, precision = 1, readOnly = false, onChange, getLabelText = (value: number) => `${value} Star`, onChangeActive, Icon }) => {
    return (
        <Fragment>
            <Box sx={sx}>
                <Rating name={name} value={value ?? undefined} onChange={onChange} onChangeActive={onChangeActive} getLabelText={getLabelText} emptyIcon={Icon} size={size} defaultValue={defaultValue ?? undefined} precision={precision} max={max} readOnly={readOnly} />
            </Box>
        </Fragment>
    );
};

export default SpkRatings;
