# My-Shorten: Fullstack Application (Node + React + TypeScript + Vite)

Solution developed for the [Challenge](https://robertoumbelino.notion.site/FW7-Challenge-3255b6dc8d5b48a187ea95cc02fdd39f).

## API routes:

### Sign up:

```http
POST /sign-up
```

**Body:**

| Name     | Type              |
| :------- | :---------------- |
| name     | string `REQUIRED` |
| email    | string `REQUIRED` |
| password | string `REQUIRED` |

**Response:**

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |

<br/>
<hr/>

### Sign in:

```http
POST /sign-in
```

**Body:**

| Name     | Type              |
| :------- | :---------------- |
| email    | string `REQUIRED` |
| password | string `REQUIRED` |

**Response:**

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |

**Response Body**

```javascript
{
  accessToken: string;
  expiresIn: Date;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
  }
}
```

<br/>
<hr/>

### Get Urls:

```http
GET /urls
```

**Params:**

| Name    | Type   | Default |
| :------ | :----- | :------ |
| page    | number | 1       |
| limit   | number | 20      |
| orderBy | string | id      |
| order   | TOrder |         |

**TOrder:** 'asc' | 'desc'

**Response:**

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |

**Response Body**

```javascript
{
  {
    totalOfRecords: number;
    records: IUrl[];
  }
}
```

**IUrl**

```javascript
{
  {
    id: number;
    code: string;
    original: string;
    userId: number;
  }
}
```

<br/>
<hr/>

### Create Url:

```http
POST /urls
```

**Body:**

| Name | Type              |
| :--- | :---------------- |
| url  | string `REQUIRED` |

**Response:**

| Status Code | Description             |
| :---------- | :---------------------- |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |

**Response Body**

```javascript
{
  {
    id: number;
    code: string;
    original: string;
    userId: number;
  }
}
```

<br/>
<hr/>

### Delete Url:

```http
DELETE /urls/:id
```

**Response:**

| Status Code | Description             |
| :---------- | :---------------------- |
| 204         | `CREATED`               |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

<br/>
<hr/>

### Get Url code:

```http
GET /get-url/:code
```

**Response:**

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

**Response Body**

```javascript
{
  {
    id: number;
    code: string;
    original: string;
    userId: number;
  }
}
```

## Mapped Errors:

**Response Body**

```javascript
{
  errors: string[];
}
```

> Contact: [J.Meira](https://github.com/J-Meira)
