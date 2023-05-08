import { useFormik } from 'formik';
import React from 'react';

import { useLabels } from '../../../../../providers/label-provider';
import Button from '../../../../button/button';
import Card from '../../../../card/card';
import CardContent from '../../../../card/card-content/card-content';
import ChoiceGroup, { TChoiceGroupValue } from '../../../../form/choice-group/choice-group';
import Col from '../../../../grid/col';
import Row from '../../../../grid/row';
import Heading from '../../../../typography/heading/heading';
import VerticalSpacing from '../../../../vertical-spacing/vertical-spacing';
import styles from '../../../table.module.scss';
import { TableFilterContext } from '../table-filter-context';

interface TableSelectColumnMeta {
  filterOptions: string[];
}

const sanitizeRowValues = (rowValues: unknown[]): unknown[] => {
  return (
    rowValues
      ?.filter(Boolean)
      // Filter out non-unique values
      ?.filter((item, index, array) => array?.indexOf(item) === index)
      // Basic sort for strings and numbers
      ?.sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        } else if (typeof a === 'string' && typeof b === 'string') {
          return a?.localeCompare?.(b);
        } else {
          return 0;
        }
      })
  );
};

export const TableSelectFilter = () => {
  const { getLabel } = useLabels();
  const { column, rows, setOpen, values: contextValues } = React.useContext(TableFilterContext);
  const filterLabel = getLabel('table.filter');
  const inputType = column?.columnDef?.filterFn;
  const fieldName: keyof typeof initialValues = inputType === 'select' ? 'selectFilter' : 'multiSelectFilter';

  const initialValues = {
    inputType,
    selectFilter: contextValues?.selectField,
    multiSelectFilter: contextValues?.multiSelectField,
  };

  const meta = column?.columnDef?.meta as TableSelectColumnMeta;
  const externalRowValues = meta?.filterOptions;

  const internalRowValues =
    // Get all values for the corresponding column id
    rows?.length && typeof column?.columnDef?.id === 'string'
      ? rows.map((i) => i?.getValue?.(column?.columnDef?.id as string))
      : [];

  const rowValues = externalRowValues?.length
    ? sanitizeRowValues(externalRowValues)
    : sanitizeRowValues(internalRowValues);

  const options =
    rowValues?.map((i, index) => ({
      id: `${column?.columnDef?.id}-choice-${index}`,
      label: String(i),
      value: String(i),
    })) || [];

  const { values, setFieldValue, handleReset, handleSubmit, errors } = useFormik({
    initialValues,
    onSubmit: (values: typeof initialValues) => {
      column?.setFilterValue(values[fieldName]?.length ? values[fieldName] : '');
      setOpen?.(false);
    },
    onReset: () => {
      column?.setFilterValue('');
      setOpen?.(false);
    },
  });

  const onSelectChange = (item: TChoiceGroupValue) => setFieldValue(fieldName, item);

  return (
    <form onSubmit={handleSubmit}>
      <VerticalSpacing>
        <Heading element="h6">{getLabel('table.filter')}</Heading>
        <Card className={styles['filter__content']} padding="medium">
          <CardContent>
            <ChoiceGroup
              id={`filter-${fieldName}-${column?.id}`}
              name={filterLabel}
              label={filterLabel}
              hideLabel
              inputType={inputType === 'select' ? 'radio' : 'checkbox'}
              size="small"
              value={values[fieldName]}
              indeterminateCheck={true}
              indeterminateCheckProps={{
                indented: false,
                className: styles['filter__indeterminate'],
              }}
              items={options}
              onChange={onSelectChange}
              helper={
                errors[fieldName]?.length !== 0 ? { text: errors[fieldName] as string, type: 'error' } : { text: '' }
              }
            />
          </CardContent>
        </Card>
        <Row gutter={2} justifyContent="end">
          <Col width="auto">
            <Button visualType="secondary" onClick={handleReset} fullWidth>
              {getLabel('clear')}
            </Button>
          </Col>
          <Col width="auto">
            <Button type="submit" fullWidth>
              {getLabel('table.filter')}
            </Button>
          </Col>
        </Row>
      </VerticalSpacing>
    </form>
  );
};
