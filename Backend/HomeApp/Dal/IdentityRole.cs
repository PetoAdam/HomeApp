using Microsoft.AspNet.Identity;
using System;

namespace HomeApp.Dal
{
    /// <summary>
    /// Class that implements the ASP.NET Identity
    /// IRole interface 
    /// </summary>
    public class IdentityRole
    {
        /// <summary>
        /// Default constructor for Role 
        /// </summary>
        public IdentityRole()
        {
        }
        /// <summary>
        /// Constructor that takes names as argument 
        /// </summary>
        /// <param name="name"></param>
        public IdentityRole(string name) : this()
        {
            Name = name;
        }

        /// <summary>
        /// Role ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Role name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Normalized role name
        /// </summary>
        public string NormalizedName { get; set; }
    }
}
