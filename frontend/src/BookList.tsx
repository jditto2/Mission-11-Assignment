import { useEffect, useState } from "react";
import { Book } from "./types/Book";

function BookList() {
    // All React state variables:
const [books, setBooks] = useState<Book[]>([]); // Holds the current list of books
const [pageSize, setPageSize] = useState<number>(10); // Number of books per page
const [pageNum, setPageNum] = useState<number>(1); // Current page number
const [totalItems, setTotalItems] = useState<number>(0); // Total number of books in DB
const [totalPages, setTotalPages] = useState<number>(0); // Total pages available
const [sortBy, setSortBy] = useState<string>('title_asc'); // Sorting order


    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch(`https://localhost:5000/api/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}`);
            const data = await response.json();
            setBooks(data.numBooks);
            setTotalItems(data.totalNumBooks);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // 👈 fix: use data.totalNumBooks, not totalItems
        };
    
        fetchProjects();
    }, [pageSize, pageNum, sortBy]); // 👈 remove totalItems from dependencies

    return (
        <div className="container my-4">
          <h1 className="text-center mb-4">Books</h1>
      
          <div className="row">
            {books.map((b) => (
              <div key={b.bookId} className="col-md-6 mb-4">
                <div className="card h-100 shadow">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{b.title}</h5>
                    <ul className="list-unstyled">
                      <li><strong>Author:</strong> {b.author}</li>
                      <li><strong>Publisher:</strong> {b.publisher}</li>
                      <li><strong>ISBN:</strong> {b.isbn}</li>
                      <li><strong>Classification:</strong> {b.classification}</li>
                      <li><strong>Page Count:</strong> {b.pageCount}</li>
                      <li><strong>Price:</strong> {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(b.price)}</li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
      
          <div className="d-flex justify-content-between align-items-center my-3">
            <label>
              <strong>Sort By:</strong>{" "}
              <select value={sortBy} onChange={(e) => {
                setSortBy(e.target.value);
                setPageNum(1);
              }}>
                <option value="title_asc">Title Asc (A-Z)</option>
                <option value="title_desc">Title Desc (Z-A)</option>
              </select>
            </label>
      
            <label>
              <strong>Results per page:</strong>{" "}
              <select value={pageSize} onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
              }}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
      
          <div className="text-center">
            <button className="btn btn-secondary mx-1" disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
              Previous
            </button>
      
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`btn mx-1 ${pageNum === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setPageNum(i + 1)}
              >
                {i + 1}
              </button>
            ))}
      
            <button className="btn btn-secondary mx-1" disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>
              Next
            </button>
          </div>
        </div>
      );      
}

export default BookList;
