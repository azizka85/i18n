const { Translator } = require('../src/translator');

describe('Translator test', () => {
  test('should translate "Hello"', () => {
    const key = 'Hello';
    const value = 'Hello translated';

    const values = {};

    values[key] = value;

    const translator = Translator.create({ values });

    const actual = translator.translate(key);

    expect(actual).toEqual(value);
  });

  test('should translate plural text', () => {
    const key = '%n comments';
  
    const zeroComments = '0 comments';
    const oneComment = '1 comment';
    const twoComments = '2 comments';
    const tenComments = '10 comments';

    const values = {};

    values[key] = [
      [0, 0, '%n comments'],
      [1, 1, '%n comment'],
      [2, null, '%n comments']
    ];

    const translator = Translator.create({ values });

    let actual = translator.translate(key, 0);

    expect(actual).toEqual(zeroComments);

    actual = translator.translate(key, 1);

    expect(actual).toEqual(oneComment);

    actual = translator.translate(key, 2);

    expect(actual).toEqual(twoComments);

    actual = translator.translate(key, 10);

    expect(actual).toEqual(tenComments);
  });

  test('should translate plural text with negative number', () => {
    const key = 'Due in %n days';

    const dueTenDaysAgo = 'Due 10 days ago';
    const dueTwoDaysAgo = 'Due 2 days ago';
    const dueYesterday = 'Due Yesterday';
    const dueToday = 'Due Today';
    const dueTomorrow = 'Due Tomorrow';
    const dueInTwoDays = 'Due in 2 days';
    const dueInTenDays = 'Due in 10 days';

    const values = {};

    values[key] = [
      [null, -2, "Due -%n days ago"],
      [-1, -1, "Due Yesterday"],
      [0, 0, "Due Today"],
      [1, 1, "Due Tomorrow"],
      [2, null, "Due in %n days"]
    ];

    const translator = Translator.create({ values });

    let actual = translator.translate(key, -10);

    expect(actual).toEqual(dueTenDaysAgo);

    actual = translator.translate(key, -2);

    expect(actual).toEqual(dueTwoDaysAgo);

    actual = translator.translate(key, -1);

    expect(actual).toEqual(dueYesterday);

    actual = translator.translate(key, 0);

    expect(actual).toEqual(dueToday);

    actual = translator.translate(key, 1);

    expect(actual).toEqual(dueTomorrow);

    actual = translator.translate(key, 2);

    expect(actual).toEqual(dueInTwoDays);

    actual = translator.translate(key, 10);

    expect(actual).toEqual(dueInTenDays);
  });

  test('should translate text with formatting', () => {
    const key = 'Welcome %{name}';
    const value = 'Welcome John';

    const translator = new Translator();

    const actual = translator.translate(key, {
      name: 'John'
    });

    expect(actual).toEqual(value);
  });

  test('should translate text using contexts', () => {
    const key = '%{name} updated their profile';

    const johnValue = 'John updated his profile';
    const janeValue = 'Jane updated her profile';

    const maleValues = {};

    maleValues[key] = '%{name} updated his profile';

    const femaleValues = {};

    femaleValues[key] = '%{name} updated her profile';

    const contexts = [{
      matches: {
        gender: 'male'
      },
      values: maleValues
    }, {
      matches: {
        gender: 'female'
      },
      values: femaleValues
    }];

    const translator = Translator.create({ contexts });

    let actual = translator.translate(
      key, 
      {
        name: 'John'
      },
      {
        gender: 'male'
      }
    );

    expect(actual).toEqual(johnValue);

    actual = translator.translate(
      key,
      {
        name: 'Jane'
      }, 
      {
        gender: 'female'
      }
    );

    expect(actual).toEqual(janeValue);
  });

  test('should translate plural text using contexts', () => {
    const key = '%{name} uploaded %n photos to their %{album} album';

    const johnValue = `John uploaded 1 photo to his Buck's Night album`;
    const janeValue = `Jane uploaded 4 photos to her Hen's Night album`;

    const maleValues = {};

    maleValues[key] = [
      [0, 0, '%{name} uploaded %n photos to his %{album} album'],
      [1, 1, '%{name} uploaded %n photo to his %{album} album'],
      [2, null, '%{name} uploaded %n photos to his %{album} album']
    ];

    const femaleValues = {};

    femaleValues[key] = [
      [0, 0, '%{name} uploaded %n photos to her %{album} album'],
      [1, 1, '%{name} uploaded %n photo to her %{album} album'],
      [2, null, '%{name} uploaded %n photos to her %{album} album']
    ];

    const contexts = [{
      matches: {
        gender: 'male'
      },
      values: maleValues
    }, {
      matches: {
        gender: 'female'
      },
      values: femaleValues
    }];

    const translator = Translator.create({ contexts });

    let actual = translator.translate(
      key, 1,
      {
        name: 'John',
        album: `Buck's Night`
      },
      {
        gender: 'male'
      }
    );

    expect(actual).toEqual(johnValue);

    actual = translator.translate(
      key, 4,
      {
        name: 'Jane',
        album: `Hen's Night`
      }, 
      {
        gender: 'female'
      }
    );

    expect(actual).toEqual(janeValue);
  });

  test('should translate plural text using extension', () => {
    const key = '%n results';

    const zeroResults = 'нет результатов';
    const oneResult = '1 результат';
    const elevenResults = '11 результатов';
    const fourResults = '4 результата';
    const results = '101 результат';

    const values = {};

    values[key] = {
      'zero': 'нет результатов',
      'one': '%n результат',
      'few': '%n результата',
      'many': '%n результатов',
      'other': '%n результаты'
    };

    const translator = Translator.create({ values });

    function getPluralisationKey(num) {
      if (!num) {
        return 'zero'
      }

      if (num % 10 == 1 && num % 100 != 11) {
        return 'one'
      }

      if ([2, 3, 4].indexOf(num % 10) >= 0 
        && [12, 13, 14].indexOf(num % 100) < 0) {
        return 'few'
      }

      if (num % 10 == 0 || [5, 6, 7, 8, 9].indexOf(num % 10) >= 0 
        || [11, 12, 13, 14].indexOf(num % 100) >= 0) {
        return 'many'
      }

      return 'other'
    }
    
    function russianExtension(text, num, formatting, data){
      let key = getPluralisationKey(num);

      return data?.[key];
    }

    translator.extend(russianExtension);

    let actual = translator.translate(key, 0);

    expect(actual).toEqual(zeroResults);

    actual = translator.translate(key, 1);

    expect(actual).toEqual(oneResult);

    actual = translator.translate(key, 11);

    expect(actual).toEqual(elevenResults);

    actual = translator.translate(key, 4);

    expect(actual).toEqual(fourResults);

    actual = translator.translate(key, 101);

    expect(actual).toEqual(results);
  });
});
