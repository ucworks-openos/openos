import React from 'react';
import Select from 'react-select';

const indicatorSeparatorStyle = {
    alignSelf: 'stretch',
    marginBottom: 8,
    marginTop: 8,
    width: 1,
};

const IndicatorSeparator = ({ innerProps }) => {
    return <span style={indicatorSeparatorStyle} {...innerProps} />;
};

function ReactSelect({ selectLists, onChange, selectValue }) {

    const onSelectChange = (selectedItems) => {
        onChange(selectedItems)
        console.log(selectedItems)
    }

    return (
        <Select
            closeMenuOnSelect={false}
            components={{ IndicatorSeparator }}
            isMulti
            options={selectLists}
            onChange={onSelectChange}
            value={selectValue}
        />
    )
}

export default ReactSelect
