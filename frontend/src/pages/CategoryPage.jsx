import React from 'react';

export default class CategoryPage extends React.Component {
    render() {
        const categories = this.props.categories || [1,2,3];

        return (
            <div className="container mt-4">
                <div className="row">
                    {categories.map((cat, index) => (
                        <div key={index} className="col-2 text-center mb-4">
                            <div
                                style={{
                                    width: "80",
                                    height: "80",
                                    borderRadius: "70%",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "20px",
                                    margin: "auto",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                }}
                            >
                                {cat.name}
                            </div>
                            <div style={{ marginTop: "8px", fontSize: "65px"  ,color:"grey"}}>
                                Category {cat.description || "No description"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
