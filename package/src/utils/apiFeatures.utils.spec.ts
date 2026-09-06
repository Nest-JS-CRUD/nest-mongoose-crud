import APIFeatures from './apiFeatures.utils';

function createMockQuery() {
  const selected: string[] = [];
  const query = {
    select: jest.fn(function (this: unknown, fields: string) {
      selected.push(fields);
      return this;
    }),
  };
  return { query, selected };
}

describe('APIFeatures.limitFields', () => {
  it('selects requested fields when no allow-list is set', () => {
    const { query, selected } = createMockQuery();

    new APIFeatures(query as any, { fields: 'name,email,password' }).limitFields();

    expect(query.select).toHaveBeenCalledWith('name email password');
    expect(selected).toEqual(['name email password']);
  });

  it('filters fields to the allow-list', () => {
    const { query } = createMockQuery();

    new APIFeatures(query as any, { fields: 'name,password,email' }, [
      'name',
      'email',
    ]).limitFields();

    expect(query.select).toHaveBeenCalledWith('name email');
  });

  it('allows exclusion syntax when the field is allow-listed', () => {
    const { query } = createMockQuery();

    new APIFeatures(query as any, { fields: '-email,-password' }, [
      'email',
    ]).limitFields();

    expect(query.select).toHaveBeenCalledWith('-email');
  });

  it('falls back to -v when all requested fields are disallowed', () => {
    const { query } = createMockQuery();

    new APIFeatures(query as any, { fields: 'password,secret' }, [
      'name',
      'email',
    ]).limitFields();

    expect(query.select).toHaveBeenCalledWith('-v');
  });

  it('uses default -v when fields is omitted', () => {
    const { query } = createMockQuery();

    new APIFeatures(query as any, {}, ['name', 'email']).limitFields();

    expect(query.select).toHaveBeenCalledWith('-v');
  });
});
